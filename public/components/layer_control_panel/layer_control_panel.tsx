/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useEffect, useState } from 'react';
import {
  DropResult,
  EuiButtonEmpty,
  EuiButtonIcon,
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
import './layer_control_panel.scss';
import { isEqual } from 'lodash';
import { i18n } from '@osd/i18n';
import { MaplibreRef } from 'public/model/layersFunctions';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { AddLayerPanel } from '../add_layer_panel';
import { LayerConfigPanel } from '../layer_config';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { LAYER_ICON_TYPE_MAP } from '../../../common';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { MapState } from '../../model/mapState';
import { moveLayers, removeLayers } from '../../model/map/layer_operations';
import { DeleteLayerModal } from './delete_layer_modal';
import { HideLayer } from './hide_layer_button';

interface Props {
  maplibreRef: MaplibreRef;
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
  layersIndexPatterns: IndexPattern[];
  setLayersIndexPatterns: (indexPatterns: IndexPattern[]) => void;
  mapState: MapState;
  zoom: number;
  isReadOnlyMode: boolean;
  selectedLayerConfig: MapLayerSpecification | undefined;
  setSelectedLayerConfig: (layerConfig: MapLayerSpecification | undefined) => void;
  setIsUpdatingLayerRender: (isUpdatingLayerRender: boolean) => void;
}

export const LayerControlPanel = memo(
  ({
    maplibreRef,
    setLayers,
    layers,
    zoom,
    isReadOnlyMode,
    selectedLayerConfig,
    setSelectedLayerConfig,
    setIsUpdatingLayerRender,
  }: Props) => {
    const { services } = useOpenSearchDashboards<MapServices>();

    const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
    const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);
    const [isNewLayer, setIsNewLayer] = useState(false);
    const [isDeleteLayerModalVisible, setIsDeleteLayerModalVisible] = useState(false);
    const [originLayerConfig, setOriginLayerConfig] = useState<MapLayerSpecification | null>(null);
    const [selectedDeleteLayer, setSelectedDeleteLayer] = useState<
      MapLayerSpecification | undefined
    >();
    const [visibleLayers, setVisibleLayers] = useState<MapLayerSpecification[]>([]);

    useEffect(() => {
      const getCurrentVisibleLayers = () => {
        return layers.filter(
          (layer: { visibility: string; zoomRange: number[] }) =>
            zoom >= layer.zoomRange[0] && zoom <= layer.zoomRange[1]
        );
      };
      setVisibleLayers(getCurrentVisibleLayers());
    }, [layers, zoom]);

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
    };

    const updateLayerVisibility = (layerId: string, visibility: string) => {
      const layersClone = [...layers];
      const index = layersClone.findIndex((layer) => layer.id === layerId);
      if (index > -1) {
        layersClone[index].visibility = String(visibility);
        setLayers(layersClone);
      }
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
        services.toastNotifications.addWarning(
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

        moveLayers(maplibreRef.current!, currentMaplibreLayerId, beforeMaplibreLayerId);

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

    const onDeleteLayerIconClick = (layer: MapLayerSpecification) => {
      setSelectedDeleteLayer(layer);
      setIsDeleteLayerModalVisible(true);
    };

    const onDeleteLayerConfirm = () => {
      if (selectedDeleteLayer) {
        removeLayers(maplibreRef.current!, selectedDeleteLayer.id, true);
        removeLayer(selectedDeleteLayer.id);
        setIsDeleteLayerModalVisible(false);
        setSelectedDeleteLayer(undefined);
      }
    };

    const onCancelDeleteLayer = () => {
      setIsDeleteLayerModalVisible(false);
      setSelectedDeleteLayer(undefined);
    };

    const getLayerTooltipContent = (layer: MapLayerSpecification) => {
      if (layer.visibility !== 'visible') {
        return i18n.translate('maps.layerControl.layerIsHidden', {
          defaultMessage: 'Layer is hidden',
        });
      }

      if (zoom < layer.zoomRange[0] || zoom > layer.zoomRange[1]) {
        return i18n.translate('maps.layerControl.layerNotVisibleZoom', {
          defaultMessage: `Layer is hidden outside of zoom range ${layer.zoomRange[0]}–${layer.zoomRange[1]}`,
        });
      }
      return '';
    };

    const layerIsVisible = (layer: MapLayerSpecification): boolean => {
      if (layer.visibility !== 'visible') {
        return false;
      }
      return visibleLayers.includes(layer);
    };

    if (isReadOnlyMode) {
      return null;
    }

    let content;
    if (isLayerControlVisible) {
      content = (
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
                                <EuiToolTip position="top" content={getLayerTooltipContent(layer)}>
                                  <EuiListGroupItem
                                    size="s"
                                    key={layer.id}
                                    label={layer.name}
                                    color={layerIsVisible(layer) ? 'text' : 'subdued'}
                                    aria-label="layer in the map layers list"
                                    onClick={() => onClickLayerName(layer)}
                                    showToolTip={false}
                                  />
                                </EuiToolTip>
                              </EuiFlexItem>
                              <EuiFlexGroup justifyContent="flexEnd" gutterSize="none">
                                <HideLayer
                                  layer={layer}
                                  maplibreRef={maplibreRef}
                                  updateLayerVisibility={updateLayerVisibility}
                                />
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
                  setIsUpdatingLayerRender={setIsUpdatingLayerRender}
                />
              )}
              <AddLayerPanel
                setIsLayerConfigVisible={setIsLayerConfigVisible}
                setSelectedLayerConfig={setSelectedLayerConfig}
                IsLayerConfigVisible={isLayerConfigVisible}
                addLayer={addLayer}
                newLayerIndex={newLayerIndex()}
                setIsNewLayer={setIsNewLayer}
                layerCount={layers.length}
              />
              {isDeleteLayerModalVisible && (
                <DeleteLayerModal
                  onCancel={onCancelDeleteLayer}
                  onConfirm={onDeleteLayerConfirm}
                  layerName={selectedDeleteLayer?.name!}
                />
              )}
            </EuiFlexGroup>
          </EuiPanel>
        </I18nProvider>
      );
    } else {
      content = (
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

    return <div className="layerControlPanel-container">{content}</div>;
  }
);
