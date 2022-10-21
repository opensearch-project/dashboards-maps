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
    }
    setIsAddNewLayerModalVisible(false);
    setIsLayerConfigVisible(true);
  }

  const availableLayers = Object.values(DASHBOARDS_MAPS_LAYER_TYPE).map((layerItem, index) => {
    return (
      <EuiFlexItem key={index}>
        <EuiKeyPadMenuItem label={`${layerItem}`} aria-label={`${layerItem}`}>
          <EuiIcon
            type="visMapRegion"
            size="xxl"
            color="primary"
            onClick={() => {
              onClickAddNewLayer(layerItem);
            }}
          />
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
            <EuiHorizontalRule />
            <EuiTitle size="s">
              <h4>Reference layer</h4>
            </EuiTitle>
            <EuiFlexGroup gutterSize="l">{availableLayers}</EuiFlexGroup>
          </EuiModalBody>
        </EuiModal>
      )}
    </div>
  );
};
