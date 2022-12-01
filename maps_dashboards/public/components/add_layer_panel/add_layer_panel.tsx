/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiHorizontalRule,
  EuiTitle,
  EuiButton,
  EuiIcon,
  EuiKeyPadMenuItem,
  EuiSpacer,
} from '@elastic/eui';
import './add_layer_panel.scss';
import { v4 as uuidv4 } from 'uuid';
import {
  LAYER_VISIBILITY,
  MAP_DEFAULT_MIN_ZOOM,
  MAP_DEFAULT_MAX_ZOOM,
  MAP_DATA_LAYER_DEFAULT_OPACITY,
  MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
  MAP_VECTOR_TILE_BASIC_STYLE,
  MAP_VECTOR_TILE_DATA_SOURCE,
  DOCUMENTS,
  OPENSEARCH_MAP_LAYER,
} from '../../../common';

interface Props {
  setIsLayerConfigVisible: Function;
  setSelectedLayerConfig: Function;
}

export const AddLayerPanel = ({ setIsLayerConfigVisible, setSelectedLayerConfig }: Props) => {
  const [isAddNewLayerModalVisible, setIsAddNewLayerModalVisible] = useState(false);

  function onClickAddNewLayer(layerType: string) {
    if (layerType === OPENSEARCH_MAP_LAYER.type) {
      setSelectedLayerConfig({
        name: OPENSEARCH_MAP_LAYER.name,
        type: OPENSEARCH_MAP_LAYER.type,
        id: uuidv4(),
        zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
        opacity: MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
        visibility: LAYER_VISIBILITY.VISIBLE,
        source: {
          dataURL: MAP_VECTOR_TILE_DATA_SOURCE,
        },
        style: {
          styleURL: MAP_VECTOR_TILE_BASIC_STYLE,
        },
      });
    } else if (layerType === DOCUMENTS.type) {
      setSelectedLayerConfig({
        name: DOCUMENTS.name,
        type: DOCUMENTS.type,
        id: uuidv4(),
        zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
        opacity: MAP_DATA_LAYER_DEFAULT_OPACITY,
        visibility: LAYER_VISIBILITY.VISIBLE,
        source: {
          indexPatternRefName: undefined,
          geoFiledType: undefined,
          geoFieldName: undefined,
          documentRequestNumber: 20,
        },
        style: {
          fillColor: '#E7664C',
        },
      });
    }
    setIsAddNewLayerModalVisible(false);
    setIsLayerConfigVisible(true);
  }

  const dataLayers = [DOCUMENTS];
  const dataLayerItems = Object.values(dataLayers).map((layerItem, index) => {
    return (
      <EuiKeyPadMenuItem
        key={layerItem.name}
        label={layerItem.name}
        onClick={() => onClickAddNewLayer(layerItem.type)}
      >
        <EuiIcon type={layerItem.icon} size="xl" color="primary" />
      </EuiKeyPadMenuItem>
    );
  });

  const referenceLayers = [OPENSEARCH_MAP_LAYER];
  const referenceLayersItems = Object.values(referenceLayers).map((layerItem, index) => {
    return (
      <EuiKeyPadMenuItem
        key={index}
        label={layerItem.name}
        aria-label={layerItem.name}
        onClick={() => onClickAddNewLayer(layerItem.type)}
      >
        <EuiIcon type={layerItem.icon} size="xl" color="primary" />
      </EuiKeyPadMenuItem>
    );
  });

  const closeModal = () => setIsAddNewLayerModalVisible(false);
  const showModal = () => setIsAddNewLayerModalVisible(true);

  return (
    <div className="addLayer">
      <EuiFlexItem className="addLayer__button">
        <EuiButton size="s" fill onClick={showModal} aria-label="Add layer">
          Add layer
        </EuiButton>
      </EuiFlexItem>
      {isAddNewLayerModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h2>Add layer</h2>
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiTitle size="s">
              <h6>Data layer</h6>
            </EuiTitle>
            <EuiSpacer size="s" />
            <EuiFlexGroup gutterSize="xs">{dataLayerItems}</EuiFlexGroup>
            <EuiSpacer size="s" />
            <EuiHorizontalRule margin="xs" />
            <EuiTitle size="s">
              <h6>Reference layer</h6>
            </EuiTitle>
            <EuiSpacer size="s" />
            <EuiFlexGroup gutterSize="xs">{referenceLayersItems}</EuiFlexGroup>
          </EuiModalBody>
        </EuiModal>
      )}
    </div>
  );
};
