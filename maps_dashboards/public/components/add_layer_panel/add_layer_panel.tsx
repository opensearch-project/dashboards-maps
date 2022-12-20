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
  EuiText,
} from '@elastic/eui';
import './add_layer_panel.scss';
import { DOCUMENTS, OPENSEARCH_MAP_LAYER, CUSTOM_MAP, Layer } from '../../../common';
import { getLayerConfigMap } from '../../utils/getIntialLayerConfig';

interface Props {
  setIsLayerConfigVisible: Function;
  setSelectedLayerConfig: Function;
  IsLayerConfigVisible: boolean;
  addLayer: Function;
  setIsNewLayer: Function;
}

export const AddLayerPanel = ({
  setIsLayerConfigVisible,
  setSelectedLayerConfig,
  IsLayerConfigVisible,
  addLayer,
  setIsNewLayer,
}: Props) => {
  const [isAddNewLayerModalVisible, setIsAddNewLayerModalVisible] = useState(false);
  const [highlightItem, setHighlightItem] = useState<Layer | null>(null);

  function onClickAddNewLayer(layerType: string) {
    const initLayerConfig = getLayerConfigMap()[layerType];
    setSelectedLayerConfig(initLayerConfig);
    setIsAddNewLayerModalVisible(false);
    setIsLayerConfigVisible(true);
    setIsNewLayer(true);
    addLayer(initLayerConfig);
  }

  const dataLayers = [DOCUMENTS];
  const dataLayerItems = Object.values(dataLayers).map((layerItem, index) => {
    return (
      <EuiKeyPadMenuItem
        key={layerItem.name}
        label={layerItem.name}
        onClick={() => onClickAddNewLayer(layerItem.type)}
        onFocus={() => setHighlightItem(layerItem)}
        onMouseEnter={() => setHighlightItem(layerItem)}
        onMouseLeave={() => setHighlightItem(null)}
        onBlur={() => setHighlightItem(null)}
      >
        <EuiIcon type={layerItem.icon} size="xl" color="secondary" />
      </EuiKeyPadMenuItem>
    );
  });

  const referenceLayers = [OPENSEARCH_MAP_LAYER, CUSTOM_MAP];
  const referenceLayersItems = Object.values(referenceLayers).map((layerItem, index) => {
    return (
      <EuiKeyPadMenuItem
        key={index}
        label={layerItem.name}
        aria-label={layerItem.name}
        onClick={() => onClickAddNewLayer(layerItem.type)}
        onFocus={() => setHighlightItem(layerItem)}
        onMouseEnter={() => setHighlightItem(layerItem)}
        onMouseLeave={() => setHighlightItem(null)}
        onBlur={() => setHighlightItem(null)}
      >
        <EuiIcon type={layerItem.icon} size="xl" color="secondary" />
      </EuiKeyPadMenuItem>
    );
  });

  const closeModal = () => setIsAddNewLayerModalVisible(false);
  const showModal = () => setIsAddNewLayerModalVisible(true);

  return (
    <div className="addLayer">
      <EuiFlexItem className="addLayer__button">
        <EuiButton
          size="s"
          fill
          onClick={showModal}
          aria-label="Add layer"
          isDisabled={IsLayerConfigVisible}
        >
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
            <EuiFlexGroup>
              <EuiFlexItem>
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
              </EuiFlexItem>
              <EuiFlexItem className="addLayerDialog__description">
                <EuiTitle size="s">
                  <h6>{highlightItem?.name ? highlightItem.name : 'Select a layer type'}</h6>
                </EuiTitle>
                <EuiSpacer size="m" />
                <EuiText>
                  {highlightItem?.description
                    ? highlightItem.description
                    : 'Start creating your map by selecting a layer type.'}
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalBody>
        </EuiModal>
      )}
    </div>
  );
};
