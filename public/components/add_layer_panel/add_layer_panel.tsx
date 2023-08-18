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
  EuiToolTip,
  EuiIcon,
  EuiKeyPadMenuItem,
  EuiSpacer,
  EuiText,
  EuiKeyPadMenu,
} from '@elastic/eui';
import './add_layer_panel.scss';
import {
  DOCUMENTS,
  OPENSEARCH_MAP_LAYER,
  CUSTOM_MAP,
  Layer,
  NEW_MAP_LAYER_DEFAULT_PREFIX,
  MAX_LAYER_LIMIT,
} from '../../../common';
import { getLayerConfigMap } from '../../utils/getIntialConfig';

interface Props {
  setIsLayerConfigVisible: Function;
  setSelectedLayerConfig: Function;
  IsLayerConfigVisible: boolean;
  addLayer: Function;
  setIsNewLayer: Function;
  newLayerIndex: number;
  layerCount: number;
}

export const AddLayerPanel = ({
  setIsLayerConfigVisible,
  setSelectedLayerConfig,
  IsLayerConfigVisible,
  addLayer,
  setIsNewLayer,
  newLayerIndex,
  layerCount,
}: Props) => {
  const [isAddNewLayerModalVisible, setIsAddNewLayerModalVisible] = useState(false);
  const [highlightItem, setHighlightItem] = useState<Layer | null>(null);

  function onClickAddNewLayer(layerType: string) {
    const initLayerConfig = getLayerConfigMap()[layerType];
    initLayerConfig.name = NEW_MAP_LAYER_DEFAULT_PREFIX + ' ' + newLayerIndex;
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
        className={'addLayer__types'}
      >
        <EuiIcon type={layerItem.icon} size="xl" color="secondary" />
      </EuiKeyPadMenuItem>
    );
  });

  const baseLayers = [OPENSEARCH_MAP_LAYER, CUSTOM_MAP];
  const baseLayersItems = Object.values(baseLayers).map((layerItem, index) => {
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
        className="addLayer__types"
      >
        <EuiIcon type={layerItem.icon} size="xl" color="secondary" />
      </EuiKeyPadMenuItem>
    );
  });

  const closeModal = () => setIsAddNewLayerModalVisible(false);
  const showModal = () => setIsAddNewLayerModalVisible(true);
  const isMaxLayerLimitReached = () => {
    return layerCount >= MAX_LAYER_LIMIT;
  };

  return (
    <div className="addLayer">
      <EuiFlexItem className="addLayer__button">
        <EuiToolTip
          display="block"
          position="top"
          content={
            <p>
              {isMaxLayerLimitReached()
                ? `You've added the maximum number of layers (${MAX_LAYER_LIMIT}).`
                : 'Add layer'}
            </p>
          }
        >
          <EuiButton
            fullWidth
            size="s"
            fill
            onClick={showModal}
            aria-label="Add layer"
            isDisabled={IsLayerConfigVisible || isMaxLayerLimitReached()}
            data-test-subj="addLayerButton"
          >
            Add layer
          </EuiButton>
        </EuiToolTip>
      </EuiFlexItem>
      {isAddNewLayerModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h2>Add layer</h2>
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody className="addLayer__modalBody">
            <EuiFlexGroup>
              <EuiFlexItem className="addLayer__selection">
                <EuiTitle size="s">
                  <h6>Data layer</h6>
                </EuiTitle>
                <EuiKeyPadMenu>{dataLayerItems}</EuiKeyPadMenu>
                <EuiHorizontalRule margin="xs" />
                <EuiSpacer size="m" />
                <EuiTitle size="s">
                  <h6>Base layer</h6>
                </EuiTitle>
                <EuiKeyPadMenu>{baseLayersItems}</EuiKeyPadMenu>
              </EuiFlexItem>
              <EuiFlexItem className="addLayerDialog__description">
                <EuiTitle size="s">
                  <h6>{highlightItem?.name ? highlightItem.name : 'Select a layer type'}</h6>
                </EuiTitle>
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
