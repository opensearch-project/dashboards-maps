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
import { MapLayerSpecification } from '../../model/mapLayerType';
import { BaseMapLayerConfigPanel } from './index';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';
import { DocumentLayerConfigPanel } from './document_layer_config_panel';

interface Props {
  setIsLayerConfigVisible: Function;
  selectedLayerConfig: MapLayerSpecification;
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
    setSelectedLayerConfig(undefined);
  };
  const onUpdate = () => {
    updateLayer();
    setIsLayerConfigVisible(false);
  };

  return (
    <EuiFlyout
      type="push"
      size="s"
      onClose={onClose}
      hideCloseButton={true}
      className="layerConfigPanel"
    >
      <EuiFlyoutHeader hasBorder={false}>
        <EuiTitle size="m">
          <h2>{selectedLayerConfig.name}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup className="layerBasicSettings" direction="column">
          <EuiFlexItem>
            {selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP && (
              <BaseMapLayerConfigPanel
                selectedLayerConfig={selectedLayerConfig}
                setSelectedLayerConfig={setSelectedLayerConfig}
              />
            )}
            {selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENT_LAYER && (
              <DocumentLayerConfigPanel
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
