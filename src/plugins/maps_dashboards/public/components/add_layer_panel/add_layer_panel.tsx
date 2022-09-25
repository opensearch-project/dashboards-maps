/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
  EuiTabbedContent,
  EuiTitle,
  EuiButton,
  EuiIcon,
  EuiKeyPadMenuItem,
} from '@elastic/eui';
import './add_layer_panel.scss';

export const AddLayerPanel = () => {
  // TODO: replace it once layers model ready
  const layers = ['Base maps', 'Region', 'Coordinate', 'WMS'];

  const selectLayers = layers.map((layerItem, index) => {
    return (
      <EuiFlexItem key={index}>
        <EuiKeyPadMenuItem label={`${layerItem}`} aria-label={`${layerItem}`}>
          <EuiIcon type="visMapRegion" size="xxl" color="primary" />
        </EuiKeyPadMenuItem>
      </EuiFlexItem>
    );
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const tabs = [
    {
      id: 'select-layer-id',
      name: 'Select layer',
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiFlexGroup gutterSize="l">{selectLayers}</EuiFlexGroup>
        </Fragment>
      ),
    },
    {
      id: 'import-id',
      name: 'Import',
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiTitle>
            <h3>Import GeoJSON or JSON</h3>
          </EuiTitle>
        </Fragment>
      ),
    },
  ];

  return (
    <div className="addLayer">
      <EuiFlexItem className="addLayer__button">
        <EuiButton size="s" fill onClick={showModal} aria-label="Add layer">
          + Add layer
        </EuiButton>
      </EuiFlexItem>
      {isModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Add layer</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <EuiTabbedContent
              tabs={tabs}
              initialSelectedTab={tabs[0]}
              autoFocus="selected"
              aria-label="Add layer tabs"
            />
          </EuiModalBody>
        </EuiModal>
      )}
    </div>
  );
};
