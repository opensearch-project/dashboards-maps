/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useEffect, useState } from 'react';
import {
  DropResult,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiConfirmModal,
  EuiDragDropContext,
  EuiDraggable,
  EuiDroppable,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiListGroupItem,
  EuiPanel,
  EuiTitle,
  EuiIcon,
  EuiToolTip,
} from '@elastic/eui';
import { I18nProvider } from '@osd/i18n/react';
import { Map as Maplibre } from 'maplibre-gl';
import './layer_control_panel.scss';
import { isEqual } from 'lodash';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { AddLayerPanel } from '../add_layer_panel';
import { LayerConfigPanel } from '../layer_config';
import { MapLayerSpecification } from '../../model/mapLayerType';
import {
  LAYER_ICON_TYPE_MAP,
  LAYER_PANEL_HIDE_LAYER_ICON,
  LAYER_PANEL_SHOW_LAYER_ICON,
  LAYER_VISIBILITY,
} from '../../../common';
import {
  LayerActions,
  layersFunctionMap,
  referenceLayerTypeLookup,
} from '../../model/layersFunctions';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import {
  handleDataLayerRender,
  handleReferenceLayerRender,
} from '../../model/layerRenderController';
import { MapState } from '../../model/mapState';
import { ConfigSchema } from '../../../common/config';

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
  zoom: number;
  mapConfig: ConfigSchema;
}

export const LayerControlPanel = memo(
  ({
    maplibreRef,
    setLayers,
    layers,
    layersIndexPatterns,
    setLayersIndexPatterns,
    mapState,
    zoom,
    mapConfig,
  }: Props) => {
    const { services } = useOpenSearchDashboards<MapServices>();
    const {
      data: { indexPatterns },
      notifications,
    } = services;

    const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
    const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);
    const [selectedLayerConfig, setSelectedLayerConfig] = useState<
      MapLayerSpecification | undefined
    >();
    const [initialLayersLoaded, setInitialLayersLoaded] = useState(false);
    const [isUpdatingLayerRender, setIsUpdatingLayerRender] = useState(false);
    const [isNewLayer, setIsNewLayer] = useState(false);
    const [isDeleteLayerModalVisible, setIsDeleteLayerModalVisible] = useState(false);
    const [originLayerConfig, setOriginLayerConfig] = useState<MapLayerSpecification | null>(null);
    const [selectedDeleteLayer, setSelectedDeleteLayer] = useState<
      MapLayerSpecification | undefined
    >();
    const [visibleLayers, setVisibleLayers] = useState<MapLayerSpecification[]>([]);

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
        if (referenceLayerTypeLookup[selectedLayerConfig.type]) {
          handleReferenceLayerRender(selectedLayerConfig, maplibreRef, undefined);
        } else {
          updateIndexPatterns();
          handleDataLayerRender(selectedLayerConfig, mapState, services, maplibreRef, undefined);
        }
        setSelectedLayerConfig(undefined);
      } else {
        layers.forEach((layer) => {
          const beforeLayerId = getMapBeforeLayerId(layer);
          if (referenceLayerTypeLookup[layer.type]) {
            handleReferenceLayerRender(layer, maplibreRef, beforeLayerId);
          } else {
            handleDataLayerRender(layer, mapState, services, maplibreRef, beforeLayerId);
          }
        });
        setInitialLayersLoaded(true);
      }
      setIsUpdatingLayerRender(false);
    }, [layers]);

    useEffect(() => {
      const getCurrentVisibleLayers = () => {
        return layers.filter(
          (layer: { visibility: string; zoomRange: number[] }) =>
            zoom >= layer.zoomRange[0] && zoom <= layer.zoomRange[1]
        );
      };
      setVisibleLayers(getCurrentVisibleLayers());
    }, [layers, zoom]);

    // Get layer id from layers that is above the selected layer
    function getMapBeforeLayerId(selectedLayer: MapLayerSpecification): string | undefined {
      const selectedLayerIndex = layers.findIndex((layer) => layer.id === selectedLayer.id);
      const beforeLayers = layers.slice(selectedLayerIndex + 1);
      if (beforeLayers.length === 0) {
        return undefined;
      }
      return beforeLayers[0]?.id;
    }

    const closeLayerConfigPanel = () => {
      setIsLayerConfigVisible(false);
      setTimeout(() => {
        maplibreRef.current?.resize();
      }, 0);
    };

    const newLayerIndex = () => {
      return layers?.length + 1;
    };

    const addLayer = (layer: MapLayerSpecification) => {
      setLayers([...layers, layer]);
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

    const hasUnsavedChanges = () => {
      if (!selectedLayerConfig || !originLayerConfig) {
        return false;
      }
      return !isEqual(originLayerConfig, selectedLayerConfig);
    };

    const onClickLayerName = (layer: MapLayerSpecification) => {
      if (hasUnsavedChanges()) {
        notifications.toasts.addWarning(
          `You have unsaved changes for ${selectedLayerConfig?.name}`
        );
      } else {
        setSelectedLayerConfig(layer);
        setIsLayerConfigVisible(true);
      }
    };

    const isLayerExists = (name: string) => {
      return layers.findIndex((layer) => layer.name === name) > -1;
    };

    const [layerVisibility, setLayerVisibility] = useState(new Map<string, boolean>([]));
    layers.forEach((layer) => {
      layerVisibility.set(layer.id, layer.visibility === LAYER_VISIBILITY.VISIBLE);
    });

    const beforeMaplibreLayerID = (source: number, destination: number) => {
      if (source > destination) {
        // if layer is moved below, move current layer below given destination
        return layers[destination].id;
      }
      const beforeIndex = destination + 1; // if layer is moved up, move current layer above destination
      if (beforeIndex < layers.length) {
        return layers[beforeIndex].id;
      }
      return undefined;
    };

    const onDragEnd = (dropResult: DropResult) => {
      if (!dropResult) {
        return;
      }
      if (dropResult.source && dropResult.destination) {
        // we display list in reverse order
        const prevIndex = getLayerIndex(dropResult.source.index);
        const newIndex = getLayerIndex(dropResult.destination.index);

        const currentMaplibreLayerId = layers[prevIndex].id;
        const beforeMaplibreLayerId = beforeMaplibreLayerID(prevIndex, newIndex);
        LayerActions.move(maplibreRef, currentMaplibreLayerId, beforeMaplibreLayerId);

        // update map layers
        const layersClone = [...layers];
        const oldLayer = layersClone[prevIndex];
        layersClone.splice(prevIndex, 1);
        layersClone.splice(newIndex, 0, oldLayer);
        setLayers(layersClone);
      }
    };

    const getLayerIndex = (reversedIndex: number) => {
      return layers.length - reversedIndex - 1;
    };

    const getReverseLayers = () => {
      const layersClone = [...layers];
      return layersClone.reverse();
    };

    const updateIndexPatterns = async () => {
      if (!selectedLayerConfig) {
        return;
      }
      if (referenceLayerTypeLookup[selectedLayerConfig.type]) {
        return;
      }
      const findIndexPattern = layersIndexPatterns.find(
        // @ts-ignore
        (indexPattern) => indexPattern.id === selectedLayerConfig.source.indexPatternId
      );
      if (!findIndexPattern) {
        // @ts-ignore
        const newIndexPattern = await indexPatterns.get(selectedLayerConfig.source.indexPatternId);
        const cloneLayersIndexPatterns = [...layersIndexPatterns, newIndexPattern];
        setLayersIndexPatterns(cloneLayersIndexPatterns);
      }
    };

    const onLayerVisibilityChange = (layer: MapLayerSpecification) => {
      if (layer.visibility === LAYER_VISIBILITY.VISIBLE) {
        layer.visibility = LAYER_VISIBILITY.NONE;
        setLayerVisibility(new Map(layerVisibility.set(layer.id, false)));
      } else {
        layer.visibility = LAYER_VISIBILITY.VISIBLE;
        setLayerVisibility(new Map(layerVisibility.set(layer.id, true)));
      }
      layersFunctionMap[layer.type]?.hide(maplibreRef, layer);
    };

    const onDeleteLayerIconClick = (layer: MapLayerSpecification) => {
      setSelectedDeleteLayer(layer);
      setIsDeleteLayerModalVisible(true);
    };

    const onDeleteLayerConfirm = () => {
      if (selectedDeleteLayer) {
        layersFunctionMap[selectedDeleteLayer.type]?.remove(maplibreRef, selectedDeleteLayer);
        removeLayer(selectedDeleteLayer.id);
        setIsDeleteLayerModalVisible(false);
        setSelectedDeleteLayer(undefined);
      }
    };

    const onCancelDeleteLayer = () => {
      setIsDeleteLayerModalVisible(false);
      setSelectedDeleteLayer(undefined);
    };

    let deleteLayerModal;
    if (isDeleteLayerModalVisible) {
      deleteLayerModal = (
        <EuiConfirmModal
          title="Delete layer"
          onCancel={onCancelDeleteLayer}
          onConfirm={onDeleteLayerConfirm}
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
          buttonColor="danger"
          defaultFocusedButton="confirm"
        >
          <p>
            Do you want to delete layer <strong>{selectedDeleteLayer?.name}</strong>?
          </p>
        </EuiConfirmModal>
      );
    }

    const getLayerTooltipContent = (layer: MapLayerSpecification) => {
      if (zoom < layer.zoomRange[0] || zoom > layer.zoomRange[1]) {
        return `Layer is not visible outside of zoom range ${layer.zoomRange[0]} - ${layer.zoomRange[1]}`;
      } else {
        return `Layer is visible within zoom range ${layer.zoomRange[0]} - ${layer.zoomRange[1]}`;
      }
    };

    const layerIsVisible = (layer: MapLayerSpecification) => {
      return visibleLayers.includes(layer);
    };

    if (isLayerControlVisible) {
      return (
        <I18nProvider>
          <EuiPanel
            paddingSize="none"
            className="layerControlPanel layerControlPanel--show"
            data-test-subj="layerControlPanel"
          >
            <EuiFlexGroup
              responsive={false}
              justifyContent="spaceBetween"
              direction="column"
              gutterSize="none"
            >
              <EuiFlexGroup direction="row" alignItems="center">
                <EuiFlexItem className="layerControlPanel__title">
                  <EuiTitle size="xs">
                    <h2>Layers</h2>
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
                    title="Collapse layers panel"
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
                              justifyContent={'flexStart'}
                            >
                              <EuiFlexItem
                                className="layerControlPanel__layerTypeIcon"
                                grow={false}
                              >
                                <EuiIcon
                                  size="m"
                                  type={LAYER_ICON_TYPE_MAP[layer.type]}
                                  color={layerIsVisible(layer) ? 'success' : '#DDDDDD'}
                                />
                              </EuiFlexItem>
                              <EuiFlexItem>
                                <EuiToolTip
                                  position="top"
                                  title={layerIsVisible(layer) ? '' : layer.name}
                                  content={
                                    layerIsVisible(layer) ? '' : getLayerTooltipContent(layer)
                                  }
                                >
                                  <EuiListGroupItem
                                    key={layer.id}
                                    label={layer.name}
                                    aria-label="layer in the map layers list"
                                    onClick={() => onClickLayerName(layer)}
                                    showToolTip={false}
                                  />
                                </EuiToolTip>
                              </EuiFlexItem>
                              <EuiFlexGroup justifyContent="flexEnd" gutterSize="none">
                                <EuiFlexItem
                                  grow={false}
                                  className="layerControlPanel__layerFunctionButton"
                                >
                                  <EuiButtonIcon
                                    iconType={
                                      layerVisibility.get(layer.id)
                                        ? LAYER_PANEL_HIDE_LAYER_ICON
                                        : LAYER_PANEL_SHOW_LAYER_ICON
                                    }
                                    size="s"
                                    onClick={() => onLayerVisibilityChange(layer)}
                                    aria-label="Hide or show layer"
                                    color="text"
                                    title={
                                      layerVisibility.get(layer.id) ? 'Hide layer' : 'Show layer'
                                    }
                                  />
                                </EuiFlexItem>
                                <EuiFlexItem
                                  grow={false}
                                  className="layerControlPanel__layerFunctionButton"
                                >
                                  <EuiButtonIcon
                                    size="s"
                                    iconType="trash"
                                    onClick={() => onDeleteLayerIconClick(layer)}
                                    aria-label="Delete layer"
                                    color={layer.id === selectedLayerConfig?.id ? 'text' : 'danger'}
                                    title="Delete layer"
                                    disabled={layer.id === selectedLayerConfig?.id}
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
                                    title="Move layer up or down"
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
                  isLayerExists={isLayerExists}
                  originLayerConfig={originLayerConfig}
                  setOriginLayerConfig={setOriginLayerConfig}
                />
              )}
              <AddLayerPanel
                setIsLayerConfigVisible={setIsLayerConfigVisible}
                setSelectedLayerConfig={setSelectedLayerConfig}
                IsLayerConfigVisible={isLayerConfigVisible}
                addLayer={addLayer}
                newLayerIndex={newLayerIndex()}
                setIsNewLayer={setIsNewLayer}
                mapConfig={mapConfig}
              />
              {deleteLayerModal}
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
          title="Expand layers panel"
        />
      </EuiFlexItem>
    );
  }
);
