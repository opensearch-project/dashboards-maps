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
  EuiDragDropContext,
  EuiDraggable,
  EuiDroppable,
  euiDragDropReorder,
} from '@elastic/eui';
import { I18nProvider } from '@osd/i18n/react';
import { Map as Maplibre } from 'maplibre-gl';
import './layer_control_panel.scss';
import { IndexPattern } from '../../../../../src/plugins/data/public';
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
import { doDataLayerRender } from '../../model/DataLayerController';
import { MapState } from '../../model/mapState';

interface MaplibreRef {
  current: Maplibre | null;
}

interface Props {
  maplibreRef: MaplibreRef;
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
  layersIndexPatterns: IndexPattern[];
  setLayersIndexPatterns: (indexPatterns: IndexPattern[]) => void;
  mapState: MapState;
}

export const LayerControlPanel = memo(
  ({
    maplibreRef,
    setLayers,
    layers,
    layersIndexPatterns,
    setLayersIndexPatterns,
    mapState,
  }: Props) => {
    const { services } = useOpenSearchDashboards<MapServices>();
    const {
      data: { indexPatterns },
    } = services;

    const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
    const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);
    const [selectedLayerConfig, setSelectedLayerConfig] = useState<
      MapLayerSpecification | undefined
    >();
    const [initialLayersLoaded, setInitialLayersLoaded] = useState(false);
    const [addLayerId, setAddLayerId] = useState('');
    const [isUpdatingLayerRender, setIsUpdatingLayerRender] = useState(false);
    const [isNewLayer, setIsNewLayer] = useState(false);

    useEffect(() => {
      if (!isUpdatingLayerRender && initialLayersLoaded) {
        return;
      }
      if (layers.length <= 0) {
        return;
      }
      if (initialLayersLoaded) {
        if (!selectedLayerConfig) {
          return;
        }
        if (selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
          layersFunctionMap[selectedLayerConfig.type].render(maplibreRef, selectedLayerConfig);
        } else {
          updateIndexPatterns();
          doDataLayerRender(selectedLayerConfig, mapState, services, maplibreRef);
        }
        if (addLayerId !== selectedLayerConfig.id) {
          setSelectedLayerConfig(undefined);
        }
      } else {
        layers.forEach((layer) => {
          if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
            layersFunctionMap[layer.type].render(maplibreRef, layer);
          } else {
            doDataLayerRender(layer, mapState, services, maplibreRef);
          }
        });
        setInitialLayersLoaded(true);
      }
      setIsUpdatingLayerRender(false);
    }, [layers]);

    const closeLayerConfigPanel = () => {
      setIsLayerConfigVisible(false);
      setTimeout(() => {
        maplibreRef.current?.resize();
      }, 0);
    };

    const addLayer = (layer: MapLayerSpecification) => {
      setLayers([...layers, layer]);
      setAddLayerId(layer.id);
    };

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
      setIsUpdatingLayerRender(true);
    };

    const removeLayer = (layerId: string) => {
      const layersClone = [...layers];
      const index = layersClone.findIndex((layer) => layer.id === layerId);
      if (index > -1) {
        layersClone.splice(index, 1);
        setLayers(layersClone);
      }
    };

    const onClickLayerName = (layer: MapLayerSpecification) => {
      setSelectedLayerConfig(layer);
      setIsLayerConfigVisible(true);
    };
    const isLayerExists = (name: string) => {
      return layers.findIndex((layer) => layer.name === name) > -1;
    };

    const [layerVisibility, setLayerVisibility] = useState(new Map<string, boolean>([]));
    layers.forEach((layer) => {
      layerVisibility.set(layer.id, layer.visibility === LAYER_VISIBILITY.VISIBLE);
    });

    const onDragEnd = ({ source, destination }) => {
      if (source && destination) {
        const reorderedLayers = euiDragDropReorder(layers, source.index, destination.index);
        setLayers(reorderedLayers);
        // TODO: Refresh Maplibre layers
      }
    };

    const getReverseLayers = () => {
      const layersClone = [...layers];
      return layersClone.reverse();
    };

    const updateIndexPatterns = async () => {
      if (!selectedLayerConfig) {
        return;
      }
      if (selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
        return;
      }
      if (!selectedLayerConfig.source.indexPatternId) {
        return;
      }
      const findIndexPattern = layersIndexPatterns.find(
        (indexPattern) => indexPattern.id === selectedLayerConfig.source.indexPatternId
      );
      if (!findIndexPattern) {
        const newIndexPattern = await indexPatterns.get(selectedLayerConfig.source.indexPatternId);
        const cloneLayersIndexPatterns = [...layersIndexPatterns, newIndexPattern];
        setLayersIndexPatterns(cloneLayersIndexPatterns);
      }
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
              <EuiDragDropContext onDragEnd={onDragEnd}>
                <EuiDroppable droppableId="LAYERS_HANDLE_DROPPABLE_AREA" spacing="none">
                  {getReverseLayers().map((layer, index) => {
                    const isLayerSelected =
                      isLayerConfigVisible &&
                      selectedLayerConfig &&
                      selectedLayerConfig.id === layer.id;
                    return (
                      <EuiDraggable
                        spacing="none"
                        key={layer.id}
                        index={index}
                        draggableId={layer.id}
                        customDragHandle={true}
                      >
                        {(provided) => (
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
                                <EuiFlexItem
                                  grow={false}
                                  className="layerControlPanel__layerFunctionButton"
                                >
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
                                        setLayerVisibility(
                                          new Map(layerVisibility.set(layer.id, false))
                                        );
                                      } else {
                                        layer.visibility = LAYER_VISIBILITY.VISIBLE;
                                        setLayerVisibility(
                                          new Map(layerVisibility.set(layer.id, true))
                                        );
                                      }
                                      layersFunctionMap[layer.type]?.hide(maplibreRef, layer);
                                    }}
                                    aria-label="Hide or show layer"
                                    color="text"
                                  />
                                </EuiFlexItem>
                                <EuiFlexItem
                                  grow={false}
                                  className="layerControlPanel__layerFunctionButton"
                                >
                                  <EuiButtonEmpty
                                    size="s"
                                    iconType="trash"
                                    onClick={() => {
                                      layersFunctionMap[layer.type]?.remove(maplibreRef, layer);
                                      removeLayer(layer.id);
                                    }}
                                    aria-label="Delete layer"
                                    color="text"
                                  />
                                </EuiFlexItem>
                                <EuiFlexItem
                                  grow={false}
                                  className="layerControlPanel__layerFunctionButton"
                                >
                                  <EuiButtonEmpty
                                    size="s"
                                    iconType="grab"
                                    {...provided.dragHandleProps}
                                    aria-label="Drag Handle"
                                    color="text"
                                  />
                                </EuiFlexItem>
                              </EuiFlexGroup>
                            </EuiFlexGroup>
                            <EuiHorizontalRule margin="none" />
                          </div>
                        )}
                      </EuiDraggable>
                    );
                  })}
                </EuiDroppable>
              </EuiDragDropContext>
              {isLayerConfigVisible && selectedLayerConfig && (
                <LayerConfigPanel
                  closeLayerConfigPanel={closeLayerConfigPanel}
                  selectedLayerConfig={selectedLayerConfig}
                  updateLayer={updateLayer}
                  setSelectedLayerConfig={setSelectedLayerConfig}
                  removeLayer={removeLayer}
                  isNewLayer={isNewLayer}
                  setIsNewLayer={setIsNewLayer}
                  layersIndexPatterns={layersIndexPatterns}
                  updateIndexPatterns={updateIndexPatterns}
                  isLayerExists={isLayerExists}
                />
              )}
              <AddLayerPanel
                setIsLayerConfigVisible={setIsLayerConfigVisible}
                setSelectedLayerConfig={setSelectedLayerConfig}
                IsLayerConfigVisible={isLayerConfigVisible}
                addLayer={addLayer}
                setIsNewLayer={setIsNewLayer}
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
  }
);
