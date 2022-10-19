/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
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
import { DASHBOARDS_MAPS_LAYER_TYPE, MAP_VECTOR_TILE_URL, LAYER_VISIBILITY } from '../../../common';

interface MaplibreRef {
  current: Maplibre | null;
}

interface Props {
  maplibreRef: MaplibreRef;
}

const LayerControlPanel = ({ maplibreRef }: Props) => {
  const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
  const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);

  const [selectedLayerConfig, setSelectedLayerConfig] = useState<ILayerConfig>({
    iconType: '',
    name: '',
    type: '',
    id: '',
    zoomRange: [],
    opacity: 1,
    visibility: '',
  });

  const [layers, setLayers] = useState<ILayerConfig[]>([
    {
      iconType: 'visMapRegion',
      id: 'example_id_1',
      type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
      name: 'Base Map Layer',
      zoomRange: [0, 12],
      opacity: 1,
      visibility: LAYER_VISIBILITY.VISIBLE,
      update() {
        const maplibreInstance = maplibreRef.current;
        if (maplibreInstance) {
          const baseMapJson = maplibreInstance.getStyle().layers;
          if (baseMapJson) {
            baseMapJson.forEach((mbLayer) => {
              maplibreInstance.setLayerZoomRange(mbLayer.id, this.zoomRange[0], this.zoomRange[1]);
              // it will catch error when update opacity in symbol type layer, need figure out later
              if (mbLayer.type === 'symbol') {
                return;
              }
              maplibreInstance.setPaintProperty(
                mbLayer.id,
                `${mbLayer.type}-opacity`,
                this.opacity
              );
              maplibreInstance.setLayoutProperty(mbLayer.id, 'visibility', this.visibility);
            });
          } else {
            maplibreInstance.setStyle(MAP_VECTOR_TILE_URL);
          }
        }
      },
      hide() {
        const maplibreInstance = maplibreRef.current;
        if (maplibreInstance) {
          const baseMapJson = maplibreInstance.getStyle().layers;
          if (baseMapJson) {
            baseMapJson.forEach((mbLayer) => {
              maplibreInstance.setLayoutProperty(mbLayer.id, 'visibility', this.visibility);
            });
          }
        }
      },
      remove() {
        const maplibreInstance = maplibreRef.current;
        if (maplibreInstance) {
          const baseMapJson = maplibreInstance.getStyle().layers;
          if (baseMapJson) {
            baseMapJson.forEach((mbLayer) => {
              maplibreInstance.removeLayer(mbLayer.id);
            });
          }
        }
      },
    },
  ]);

  useEffect(() => {
    layers.forEach((layer) => {
      layer.update?.();
    });
  }, [layers]);

  const updateLayers = () => {
    const layersClone = [...layers];
    const index = layersClone.findIndex((layer) => layer.id === selectedLayerConfig.id);
    if (index > -1) {
      layersClone[index] = {
        ...layersClone[index],
        ...selectedLayerConfig,
      };
    } else {
      layersClone.push(selectedLayerConfig);
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
                  <EuiFlexGroup
                    alignItems="center"
                    gutterSize="none"
                    direction="row"
                    onClick={() => {
                      if (!isLayerConfigVisible) {
                        setSelectedLayerConfig(layer);
                      }
                    }}
                  >
                    <EuiFlexItem>
                      <EuiListGroupItem
                        key={layer.id}
                        label={layer.name}
                        data-item={JSON.stringify(layer)}
                        iconType={layer.iconType}
                        aria-label="layer in the map layers list"
                        isDisabled={isDisabled}
                        onClick={() => {
                          if (selectedLayerConfig.id === layer.id && !isLayerConfigVisible) {
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
                            layer.hide(index);
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
                            layer.remove(index);
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
            {isLayerConfigVisible && (
              <LayerConfigPanel
                setIsLayerConfigVisible={setIsLayerConfigVisible}
                selectedLayerConfig={selectedLayerConfig}
                updateLayer={updateLayers}
                setSelectedLayerConfig={setSelectedLayerConfig}
              />
            )}
            <AddLayerPanel
              setIsLayerConfigVisible={setIsLayerConfigVisible}
              setSelectedLayerConfig={setSelectedLayerConfig}
              addNewLayerFunction={updateLayers}
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
};

export { LayerControlPanel };
