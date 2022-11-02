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
} from '@elastic/eui';
import './add_layer_panel.scss';
import { v4 as uuidv4 } from 'uuid';
import { DASHBOARDS_MAPS_LAYER_TYPE, LAYER_VISIBILITY } from '../../../common';

interface Props {
  setIsLayerConfigVisible: Function;
  setSelectedLayerConfig: Function;
}

export const AddLayerPanel = ({ setIsLayerConfigVisible, setSelectedLayerConfig }: Props) => {
  const [isAddNewLayerModalVisible, setIsAddNewLayerModalVisible] = useState(false);

  function onClickAddNewLayer(layerItem: string) {
    if (layerItem === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
      setSelectedLayerConfig({
        iconType: 'visMapRegion',
        name: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
        type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
        id: uuidv4(),
        zoomRange: [0, 22],
        opacity: 1,
        visibility: LAYER_VISIBILITY.VISIBLE,
      });
    } else if (layerItem === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENT_LAYER) {
      setSelectedLayerConfig({
        iconType: 'document',
        name: DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENT_LAYER,
        type: DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENT_LAYER,
        id: uuidv4(),
        zoomRange: [0, 22],
        opacity: 0.5,
        visibility: LAYER_VISIBILITY.VISIBLE,
        source: null,
      });
    }
    setIsAddNewLayerModalVisible(false);
    setIsLayerConfigVisible(true);
  }

  const dataLayers = [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENT_LAYER];
  const dataLayerItems = dataLayers.map((layerItem) => {
    return (
      <EuiKeyPadMenuItem
        key={layerItem}
        label={layerItem}
        onClick={() => onClickAddNewLayer(layerItem)}
      >
        <EuiIcon type="visMapRegion" size="xxl" color="primary" />
      </EuiKeyPadMenuItem>
    );
  });

  const referenceLayers = [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP];
  const referenceLayersItems = Object.values(referenceLayers).map((layerItem, index) => {
    return (
      <EuiFlexItem key={index}>
        <EuiKeyPadMenuItem
          label={layerItem}
          aria-label={layerItem}
          onClick={() => onClickAddNewLayer(layerItem)}
        >
          <EuiIcon type="visMapRegion" size="xxl" color="primary" />
        </EuiKeyPadMenuItem>
      </EuiFlexItem>
    );
  });

  const closeModal = () => setIsAddNewLayerModalVisible(false);
  const showModal = () => setIsAddNewLayerModalVisible(true);

  return (
    <div className="addLayer">
      <EuiFlexItem className="addLayer__button">
        <EuiButton size="s" fill onClick={showModal} aria-label="Add layer">
          + Add layer
        </EuiButton>
      </EuiFlexItem>
      {isAddNewLayerModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Add layer</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiTitle size="s">
              <h4>Data layer</h4>
            </EuiTitle>
            <EuiFlexGroup gutterSize="l">{dataLayerItems}</EuiFlexGroup>
            <EuiHorizontalRule />
            <EuiTitle size="s">
              <h4>Reference layer</h4>
            </EuiTitle>
            <EuiFlexGroup gutterSize="l">{referenceLayersItems}</EuiFlexGroup>
          </EuiModalBody>
        </EuiModal>
      )}
    </div>
  );
};
