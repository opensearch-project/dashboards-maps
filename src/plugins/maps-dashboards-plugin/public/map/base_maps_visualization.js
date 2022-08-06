/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { i18n } from '@osd/i18n';
import { getEmsTileLayerId, getUiSettings, getToasts } from '../maps_explorer_dashboards_services';
import { lazyLoadMapsExplorerDashboardsModules } from '../lazy_load_bundle';
import { getServiceSettings } from '../get_service_settings';
import { DEFAULT_MAP_EXPLORER_VIS_PARAMS, LayerTypes } from '../common/types/layer';

const DEFAULT_MINZOOM = 0;
const DEFAULT_MAXZOOM = 22; //increase this to 22. Better for WMS

export function BaseMapsVisualizationProvider() {
  /**
   * Abstract base class for a visualization consisting of a map with a openSearchDashboardsMapLayer.
   * @class BaseMapsVisualization
   * @constructor
   */
  return class BaseMapsVisualization {
    constructor(element, vis) {
      this.vis = vis;
      this._container = element;
      this._opensearchDashboardsMap = null;
      this._chartData = null; //reference to data currently on the map.
      this._mapIsLoaded = this._makeOpenSearchDashboardsMap();
      // layer id : openSearchDashboards map layer
      this._layers = {} 
    }

    isLoaded() {
      return this._mapIsLoaded;
    }

    destroy() {
      if (this._opensearchDashboardsMap) {
        this._opensearchDashboardsMap.destroy();
        this._opensearchDashboardsMap = null;
      }
    }

    /**
     * Implementation of Visualization#render.
     * Child-classes can extend this method if the render-complete function requires more time until rendering has completed.
     * @param opensearchResponse
     * @param status
     * @return {Promise}
     */
    async render(opensearchResponse, visParams) {
      if (!this._opensearchDashboardsMap) {
        //the visualization has been destroyed;
        return;
      }

      await this._mapIsLoaded;
      this._opensearchDashboardsMap.resize();
      this._params = visParams;
      await this._updateParams();

      if (this._hasOpenSearchResponseChanged(opensearchResponse)) {
        await this._updateData(opensearchResponse);
      }
      this._opensearchDashboardsMap.useUiStateFromVisualization(this.vis);
      await this._updateLayers();
    }

    /**
     * Creates an instance of a opensearch-dashboards-map with a openSearchDashboardsMapLayer and assigns it to the this._opensearchDashboardsMap property.
     * Clients can override this method to customize the initialization.
     * @private
     */
    async _makeOpenSearchDashboardsMap() {
      const options = {};
      const uiState = this.vis.getUiState();
      const zoomFromUiState = parseInt(uiState.get('mapZoom'));
      const centerFromUIState = uiState.get('mapCenter');
      options.zoom = !isNaN(zoomFromUiState) ? zoomFromUiState : this.vis.params.mapZoom;
      options.center = centerFromUIState ? centerFromUIState : this.vis.params.mapCenter;

      const modules = await lazyLoadMapsExplorerDashboardsModules();
      this.L = modules.L;
      this._opensearchDashboardsMap = new modules.OpenSearchDashboardsMap(this._container, options);
      this._opensearchDashboardsMap.setMinZoom(DEFAULT_MINZOOM); //use a default
      this._opensearchDashboardsMap.setMaxZoom(DEFAULT_MAXZOOM); //use a default

      this._opensearchDashboardsMap.addLegendControl();
      this._opensearchDashboardsMap.addFitControl();
      this._opensearchDashboardsMap.persistUiStateForVisualization(this.vis);
      await this._updateLayers();
    }

    /**
     * Update layers with new params
     */
    async _updateLayers() {
      const { layersOptions, layerIdOrder } = this._getMapsParams();
      // remove the deleted and hidden layers 
      for (let layerId in this._layers) {
        if (layerIdOrder.find((id) => { return id === layerId }) === undefined || layersOptions[layerId].isHidden === true) {
          this._opensearchDashboardsMap.removeLayer(this._layers[layerId]);
          delete this._layers[layerId];
        }
      }

      for (const id of layerIdOrder) {
        const layerOptions = layersOptions[id];
        if (layerOptions.isHidden) {
          continue;
        }
        if (!this._layers[id]) {
          let newLayer = null;
          switch (layerOptions.layerType) {
            case LayerTypes.TMSLayer: newLayer = await this._createTmsLayer(layerOptions); break;
            case LayerTypes.WMSLayer: newLayer = await this._createWmsLayer(layerOptions); break;
            default:
              throw new Error(
                i18n.translate('mapExplorerDashboard.layerType.unsupportedErrorMessage', {
                  defaultMessage: '{layerType} layer type not recognized',
                  values: {
                    layerType: layerOptions.layerType,
                  },
                })
              );
          }
          if (newLayer) {
            await newLayer.updateOptions(layerOptions).then(() => {
              this._opensearchDashboardsMap.addLayer(newLayer);
              this._layers[id] = newLayer;
            });
          }
        } else {
          await this._layers[id].updateOptions(layerOptions);
        }
        this._layers[id].bringToFront();
      }
    }

    async _createTmsLayer(newOptions) {
      const { TMSLayer } = await import('./layer/tms_layer/tms_layer');
      const tmsLayer = new TMSLayer(newOptions, this._opensearchDashboardsMap, this.L);
      return tmsLayer;
    }

    async _createWmsLayer(newOptions) {
      const { WMSLayer } = await import('./layer/wms_layer/wms_layer');
      const wmsLayer = new WMSLayer(newOptions, this._opensearchDashboardsMap, this.L);
      return wmsLayer;
    }

    async _updateData() {
      // TODO: remove the error and implement _updateData() in base_map_visualization 
      // throw new Error(
      //   i18n.translate('maps_legacy.baseMapsVisualization.childShouldImplementMethodErrorMessage', {
      //     defaultMessage: 'Child should implement this method to respond to data-update',
      //   })
      // );
    }

    _hasOpenSearchResponseChanged(data) {
      return this._chartData !== data;
    }

    /**
     * called on options change (vis.params change)
     */
    async _updateParams() {
      const mapParams = this._getMapsParams();
      // this._opensearchDashboardsMap.setLegendPosition(mapParams.legendPosition);
      this._opensearchDashboardsMap.setShowTooltip(mapParams.addTooltip);
      this._opensearchDashboardsMap.useUiStateFromVisualization(this.vis);
    }

    _getMapsParams() {
      return {
        ...DEFAULT_MAP_EXPLORER_VIS_PARAMS,
        type: this.vis.type.name,
        ...this._params,
      };
    }
  };
}
