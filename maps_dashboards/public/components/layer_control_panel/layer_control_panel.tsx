/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useEffect, useState } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiListGroupItem,
  EuiButtonEmpty,
  EuiHorizontalRule,
  EuiButtonIcon,
} from '@elastic/eui';
import { I18nProvider } from '@osd/i18n/react';
import { Map as Maplibre } from 'maplibre-gl';
import './layer_control_panel.scss';
import { AddLayerPanel } from '../add_layer_panel';
import { LayerConfigPanel } from '../layer_config';
import { MapLayerSpecification } from '../../model/mapLayerType';
import {
  LAYER_VISIBILITY,
  DASHBOARDS_MAPS_LAYER_TYPE,
  LAYER_ICON_TYPE_MAP,
  LAYER_PANEL_SHOW_LAYER_ICON,
  LAYER_PANEL_HIDE_LAYER_ICON,
} from '../../../common';
import { layersFunctionMap } from '../../model/layersFunctions';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import {
  IOpenSearchDashboardsSearchResponse,
  isCompleteResponse,
} from '../../../../../src/plugins/data/common';

interface MaplibreRef {
  current: Maplibre | null;
}

interface Props {
  maplibreRef: MaplibreRef;
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
}

const LayerControlPanel = memo(({ maplibreRef, setLayers, layers }: Props) => {
  const {
    services: {
      data: { search },
      notifications,
    },
  } = useOpenSearchDashboards<MapServices>();

  const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
  const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);
  const [selectedLayerConfig, setSelectedLayerConfig] = useState<
    MapLayerSpecification | undefined
  >();
  const [initialLayersLoaded, setInitialLayersLoaded] = useState(false);

  // Initially load the layers from the saved object
  useEffect(() => {
    if (layers.length <= 0) {
      return;
    }
    const doDataLayerRender = async (layer: MapLayerSpecification) => {
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
        const sourceConfig = layer.source;
        const indexPatternRefName = sourceConfig?.indexPatternRefName;
        const geoField = sourceConfig.geoFieldName;
        const request = {
          params: {
            index: indexPatternRefName,
            size: layer.source.documentRequestNumber,
            body: {
              _source: geoField,
            },
          },
        };
        const search$ = search.search(request).subscribe({
          next: (response: IOpenSearchDashboardsSearchResponse) => {
            if (isCompleteResponse(response)) {
              const dataSource = response.rawResponse.hits.hits;
              layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource);
              search$.unsubscribe();
            } else {
              notifications.toasts.addWarning('An error has occurred when query dataSource');
              search$.unsubscribe();
            }
          },
          error: (e: Error) => {
            search.showError(e);
          },
        });
      }
    };
    if (initialLayersLoaded) {
      if (!selectedLayerConfig) {
        return;
      }
      if (selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
        layersFunctionMap[selectedLayerConfig.type].render(maplibreRef, selectedLayerConfig);
      } else {
        doDataLayerRender(selectedLayerConfig);
      }
      setSelectedLayerConfig(undefined);
    } else {
      layers.forEach((layer) => {
        if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
          layersFunctionMap[layer.type].render(maplibreRef, layer);
        } else {
          doDataLayerRender(layer);
        }
      });
      setInitialLayersLoaded(true);
    }
  }, [layers]);

  const updateLayer = () => {
    if (!selectedLayerConfig) {
      return;
    }
    const layersClone = [...layers];
    const index = layersClone.findIndex((layer) => layer.id === selectedLayerConfig.id);
    if (index <= -1) {
      layersClone.push(selectedLayerConfig);
    } else {
      layersClone[index] = {
        ...layersClone[index],
        ...selectedLayerConfig,
      };
    }
    setLayers(layersClone);
  };

  const removeLayer = (index: number) => {
    const layersClone = [...layers];
    layersClone.splice(index, 1);
    setLayers(layersClone);
  };

  const onClickLayerName = (layer: MapLayerSpecification) => {
    setSelectedLayerConfig(layer);
    setIsLayerConfigVisible(true);
  };

  const [layerVisibility, setLayerVisibility] = useState(new Map<string, boolean>([]));
  layers.forEach((layer) => {
    layerVisibility.set(layer.id, layer.visibility === LAYER_VISIBILITY.VISIBLE);
  });

  if (isLayerControlVisible) {
    return (
      <I18nProvider>
        <EuiPanel paddingSize="none" className="layerControlPanel layerControlPanel--show">
          <EuiFlexGroup
            responsive={false}
            justifyContent="spaceBetween"
            direction="column"
            gutterSize="none"
          >
            <EuiFlexGroup direction="row" alignItems="center">
              <EuiFlexItem className="layerControlPanel__title">
                <EuiTitle size="xs">
                  <h2>Layer</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  size="s"
                  iconType="menuLeft"
                  onClick={() => setIsLayerControlVisible((visible) => !visible)}
                  aria-label="Hide layer control"
                  color="text"
                  className="layerControlPanel__visButton"
                />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule margin="none" />
            {layers.map((layer, index) => {
              const isLayerSelected =
                isLayerConfigVisible && selectedLayerConfig && selectedLayerConfig.id === layer.id;
              return (
                <div key={layer.id}>
                  <EuiFlexGroup
                    className={isLayerSelected ? 'layerControlPanel__selected' : ''}
                    alignItems="center"
                    gutterSize="none"
                    direction="row"
                  >
                    <EuiFlexItem>
                      <EuiListGroupItem
                        key={layer.id}
                        label={layer.name}
                        data-item={JSON.stringify(layer)}
                        iconType={LAYER_ICON_TYPE_MAP[layer.type]}
                        aria-label="layer in the map layers list"
                        onClick={() => onClickLayerName(layer)}
                      />
                    </EuiFlexItem>
                    <EuiFlexGroup justifyContent="flexEnd" gutterSize="none">
                      <EuiFlexItem grow={false} className="layerControlPanel__layerFunctionButton">
                        <EuiButtonEmpty
                          iconType={
                            layerVisibility.get(layer.id)
                              ? LAYER_PANEL_HIDE_LAYER_ICON
                              : LAYER_PANEL_SHOW_LAYER_ICON
                          }
                          size="s"
                          onClick={() => {
                            if (layer.visibility === LAYER_VISIBILITY.VISIBLE) {
                              layer.visibility = LAYER_VISIBILITY.NONE;
                              setLayerVisibility(new Map(layerVisibility.set(layer.id, false)));
                            } else {
                              layer.visibility = LAYER_VISIBILITY.VISIBLE;
                              setLayerVisibility(new Map(layerVisibility.set(layer.id, true)));
                            }
                            layersFunctionMap[layer.type]?.hide(maplibreRef, layer);
                          }}
                          aria-label="Hide or show layer"
                          color="text"
                        />
                      </EuiFlexItem>
                      <EuiFlexItem grow={false} className="layerControlPanel__layerFunctionButton">
                        <EuiButtonEmpty
                          size="s"
                          iconType="trash"
                          onClick={() => {
                            layersFunctionMap[layer.type]?.remove(maplibreRef, layer);
                            removeLayer(index);
                          }}
                          aria-label="Delete layer"
                          color="text"
                        />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexGroup>
                  <EuiHorizontalRule margin="none" />
                </div>
              );
            })}
            {isLayerConfigVisible && selectedLayerConfig && (
              <LayerConfigPanel
                setIsLayerConfigVisible={setIsLayerConfigVisible}
                selectedLayerConfig={selectedLayerConfig}
                updateLayer={updateLayer}
                setSelectedLayerConfig={setSelectedLayerConfig}
              />
            )}
            <AddLayerPanel
              setIsLayerConfigVisible={setIsLayerConfigVisible}
              setSelectedLayerConfig={setSelectedLayerConfig}
              IsLayerConfigVisible={isLayerConfigVisible}
            />
          </EuiFlexGroup>
        </EuiPanel>
      </I18nProvider>
    );
  }

  return (
    <EuiFlexItem grow={false} className="layerControlPanel layerControlPanel--hide">
      <EuiButtonIcon
        className="layerControlPanel__visButton"
        size="s"
        iconType="menuRight"
        onClick={() => setIsLayerControlVisible((visible) => !visible)}
        aria-label="Show layer control"
      />
    </EuiFlexItem>
  );
});

export { LayerControlPanel };
