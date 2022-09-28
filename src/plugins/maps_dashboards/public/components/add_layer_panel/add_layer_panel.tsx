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
import { LAYER_TYPE } from '../../../common';

interface Props {
  setIsLayerConfigVisible: Function;
}

export const AddLayerPanel = ({ setIsLayerConfigVisible }: Props) => {
  const [isAddNewLayerModalVisible, setIsAddNewLayerModalVisible] = useState(false);

  const availableLayers = Object.values(LAYER_TYPE).map((layerItem, index) => {
    return (
      <EuiFlexItem key={index}>
        <EuiKeyPadMenuItem label={`${layerItem}`} aria-label={`${layerItem}`}>
          <EuiIcon
            type="visMapRegion"
            size="xxl"
            color="primary"
            onClick={() => {
              setIsAddNewLayerModalVisible(false);
              setIsLayerConfigVisible(true);
            }}
          />
        </EuiKeyPadMenuItem>
      </EuiFlexItem>
    );
  });

  const closeModal = () => setIsAddNewLayerModalVisible(false);
  const showModal = () => setIsAddNewLayerModalVisible(true);

  const tabs = [
    {
      id: 'select-layer-id',
      name: 'Select layer',
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiFlexGroup gutterSize="l">{availableLayers}</EuiFlexGroup>
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
      {isAddNewLayerModalVisible && (
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
