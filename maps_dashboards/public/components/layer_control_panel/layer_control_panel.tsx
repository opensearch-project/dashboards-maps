/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { AddLayerPanel } from '../add_layer_panel';
import { LayerConfigPanel } from '../layer_config';
import { ILayerConfig } from '../../model/ILayerConfig';
import {
  DASHBOARDS_MAPS_LAYER_TYPE,
  LAYER_VISIBILITY,
  MAP_VECTOR_TILE_BASIC_STYLE,
} from '../../../common';
import { layersFunctionMap } from '../../model/layersFunctions';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';

interface MaplibreRef {
  current: Maplibre | null;
}

interface Props {
  maplibreRef: MaplibreRef;
  mapIdFromUrl: string;
  setLayers: (layers: ILayerConfig[]) => void;
  layers: ILayerConfig[];
}

const LayerControlPanel = ({ maplibreRef, mapIdFromUrl, setLayers, layers }: Props) => {
  const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
  const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);
  const {
    services: {
      savedObjects: { client: savedObjectsClient },
    },
  } = useOpenSearchDashboards<MapServices>();

  const fetchLayers = useCallback(async (): Promise<{
    layers: ILayerConfig[];
  }> => {
    const savedMapObject = await savedObjectsClient.get<MapSavedObjectAttributes>(
      'map',
      mapIdFromUrl
    );
    const SavedLayers = JSON.parse(savedMapObject.attributes.layerList as string);
    return {
      layers: SavedLayers,
    };
  }, [savedObjectsClient, mapIdFromUrl]);

  const [selectedLayerConfig, setSelectedLayerConfig] = useState<ILayerConfig>({
    iconType: '',
    name: '',
    type: '',
    id: '',
    zoomRange: [],
    opacity: 1,
    visibility: '',
  });

  const initialDefaultLayer: ILayerConfig = {
    iconType: 'visMapRegion',
    id: uuidv4(),
    type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
    name: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
    zoomRange: [0, 22],
    opacity: 1,
    visibility: LAYER_VISIBILITY.VISIBLE,
    layerSpec: {
      OSMUrl: MAP_VECTOR_TILE_BASIC_STYLE,
    },
  };

  // Initially load the layers from the saved object
  useEffect(() => {
    maplibreRef.current?.on('load', function () {
      if (!!mapIdFromUrl) {
        fetchLayers().then((res) => {
          const layersFromSavedMap = res.layers;
          layersFromSavedMap.forEach((layer) => {
            layersFunctionMap[layer.type]?.initial(maplibreRef, layer);
          });
          setLayers(res.layers);
        });
      } else {
        layersFunctionMap[initialDefaultLayer.type]?.initial(maplibreRef, initialDefaultLayer);
        setLayers([initialDefaultLayer]);
      }
    });
  }, []);

  const updateLayer = () => {
    const layersClone = [...layers];
    const index = layersClone.findIndex((layer) => layer.id === selectedLayerConfig.id);
    if (index <= -1) {
      layersClone.push(selectedLayerConfig);
      layersFunctionMap[selectedLayerConfig.type]?.addNewLayer(maplibreRef, selectedLayerConfig);
    } else {
      layersClone[index] = {
        ...layersClone[index],
        ...selectedLayerConfig,
      };
    }
    setLayers(layersClone);
    setTimeout(function () {
      layersFunctionMap[selectedLayerConfig.type]?.update(maplibreRef, selectedLayerConfig);
    }, 50);
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
            {isLayerConfigVisible && (
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
};

export { LayerControlPanel };
