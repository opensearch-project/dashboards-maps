/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiButton,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiFlexGroup,
} from '@elastic/eui';
import { ILayerConfig } from '../../model/ILayerConfig';
import { BaseMapLayerConfigPanel } from './index';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';

interface Props {
  setIsLayerConfigVisible: Function;
  selectedLayerConfig: ILayerConfig;
  setSelectedLayerConfig: Function;
  updateLayer: Function;
}

export const LayerConfigPanel = ({
  setIsLayerConfigVisible,
  selectedLayerConfig,
  setSelectedLayerConfig,
  updateLayer,
}: Props) => {
  const onClose = () => {
    setIsLayerConfigVisible(false);
    setSelectedLayerConfig({});
  };
  const onUpdate = () => {
    updateLayer();
    onClose();
  };

  return (
    <EuiFlyout
      type="push"
      size="s"
      onClose={onClose}
      hideCloseButton={true}
      className="layerConfigPanel"
    >
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>{selectedLayerConfig.name}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup className="layerBasicSettings" direction="column">
          <EuiFlexItem className="layerBasicSettings__header">
            <EuiTitle size="xs">
              <h2>Layer settings</h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem>
            {selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP && (
              <BaseMapLayerConfigPanel
                selectedLayerConfig={selectedLayerConfig}
                setSelectedLayerConfig={setSelectedLayerConfig}
              />
            )}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty iconType="cross" onClick={onClose} flush="left">
              Discard
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton iconType="play" onClick={onUpdate} fill>
              Update
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
};
