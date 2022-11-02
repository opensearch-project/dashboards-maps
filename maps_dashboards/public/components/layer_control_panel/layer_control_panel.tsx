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
  EuiButton,
} from '@elastic/eui';
import { I18nProvider } from '@osd/i18n/react';
import { Map as Maplibre } from 'maplibre-gl';
import './layer_control_panel.scss';
import { AddLayerPanel } from '../add_layer_panel';
import { LayerConfigPanel } from '../layer_config';
import { ILayerConfig } from '../../model/ILayerConfig';
import { LAYER_VISIBILITY, DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';
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
  setLayers: (layers: ILayerConfig[]) => void;
  layers: ILayerConfig[];
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
  const [selectedLayerConfig, setSelectedLayerConfig] = useState<ILayerConfig | undefined>();
  const [initialLayersLoaded, setInitialLayersLoaded] = useState(false);

  // Initially load the layers from the saved object
  useEffect(() => {
    if (layers.length <= 0) {
      return;
    }
    const doDataLayerRender = async (layer: ILayerConfig) => {
      const sourceConfig = layer.source;
      const indexPatternRefName = sourceConfig.indexPatternRefName;
      const geoField = sourceConfig.geoField;
      const request = {
        params: {
          index: indexPatternRefName,
          // TODO: update size after adding query bar
          size: 100,
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
                  <h2>Map layers</h2>
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
              const isDisabled =
                isLayerConfigVisible && selectedLayerConfig && selectedLayerConfig.id === layer.id;
              return (
                <div key={layer.id}>
                  <EuiFlexGroup alignItems="center" gutterSize="none" direction="row">
                    <EuiFlexItem>
                      <EuiListGroupItem
                        key={layer.id}
                        label={layer.name}
                        data-item={JSON.stringify(layer)}
                        iconType={layer.iconType}
                        aria-label="layer in the map layers list"
                        isDisabled={isDisabled}
                        onClick={() => {
                          setSelectedLayerConfig(layer);
                          if (
                            selectedLayerConfig &&
                            selectedLayerConfig.id === layer.id &&
                            !isLayerConfigVisible
                          ) {
                            setIsLayerConfigVisible(true);
                          }
                        }}
                      />
                    </EuiFlexItem>
                    <EuiFlexGroup justifyContent="flexEnd" gutterSize="none">
                      <EuiFlexItem grow={false} className="layerControlPanel__layerFunctionButton">
                        <EuiButtonEmpty
                          iconType="eyeClosed"
                          size="s"
                          onClick={() => {
                            if (layer.visibility === LAYER_VISIBILITY.VISIBLE) {
                              layer.visibility = LAYER_VISIBILITY.NONE;
                            } else {
                              layer.visibility = LAYER_VISIBILITY.VISIBLE;
                            }
                            layersFunctionMap[layer.type]?.hide(maplibreRef, layer);
                          }}
                          aria-label="Hide or show layer"
                          color="text"
                          isDisabled={isDisabled}
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
                          isDisabled={isDisabled}
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
            />
          </EuiFlexGroup>
        </EuiPanel>
      </I18nProvider>
    );
  }

  return (
    <EuiFlexItem grow={false} className="layerControlPanel layerControlPanel--hide">
      <EuiButton
        className="layerControlPanel__visButton"
        size="s"
        iconType="menuRight"
        iconSide="right"
        onClick={() => setIsLayerControlVisible((visible) => !visible)}
        aria-label="Show layer control"
      >
        Map layers
      </EuiButton>
    </EuiFlexItem>
  );
});

export { LayerControlPanel };
