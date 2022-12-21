/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { cloneDeep, isEqual } from 'lodash';

import {
  EuiButton,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';

import { MapLayerSpecification } from '../../model/mapLayerType';
import { BaseMapLayerConfigPanel } from './index';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';
import { DocumentLayerConfigPanel } from './documents_config/document_layer_config_panel';

interface Props {
  closeLayerConfigPanel: Function;
  selectedLayerConfig: MapLayerSpecification;
  setSelectedLayerConfig: Function;
  updateLayer: Function;
  removeLayer: Function;
  isNewLayer: boolean;
  setIsNewLayer: Function;
  isLayerExists: Function;
}

export const LayerConfigPanel = ({
  closeLayerConfigPanel,
  selectedLayerConfig,
  setSelectedLayerConfig,
  updateLayer,
  removeLayer,
  isNewLayer,
  setIsNewLayer,
  isLayerExists,
}: Props) => {
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [originLayerConfig, setOriginLayerConfig] = useState<MapLayerSpecification | null>(null);
  const [warnModalVisible, setWarnModalVisible] = useState(false);

  useEffect(() => {
    setOriginLayerConfig(cloneDeep(selectedLayerConfig));
  }, []);

  const discardChanges = () => {
    closeLayerConfigPanel(false);
    setSelectedLayerConfig(undefined);
  };
  const onClose = () => {
    if (isEqual(originLayerConfig, selectedLayerConfig)) {
      discardChanges();
    } else {
      setWarnModalVisible(true);
    }
    if (isNewLayer) {
      removeLayer(selectedLayerConfig.id);
      setIsNewLayer(false);
    }
  };
  const onUpdate = () => {
    updateLayer();
    closeLayerConfigPanel(false);
  };

  const closeModal = () => {
    setWarnModalVisible(false);
  };

  return (
    <EuiFlyout
      type="push"
      size="s"
      onClose={onClose}
      hideCloseButton={true}
      className="layerConfigPanel"
    >
      <EuiFlyoutHeader hasBorder={true}>
        <strong>{selectedLayerConfig.name}</strong>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup className="layerBasicSettings" direction="column">
          <EuiFlexItem>
            {selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP && (
              <BaseMapLayerConfigPanel
                selectedLayerConfig={selectedLayerConfig}
                setSelectedLayerConfig={setSelectedLayerConfig}
                setIsUpdateDisabled={setIsUpdateDisabled}
                isLayerExists={isLayerExists}
              />
            )}
            {selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS && (
              <DocumentLayerConfigPanel
                selectedLayerConfig={selectedLayerConfig}
                setSelectedLayerConfig={setSelectedLayerConfig}
                setIsUpdateDisabled={setIsUpdateDisabled}
                isLayerExists={isLayerExists}
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
            <EuiButton disabled={isUpdateDisabled} iconType="play" onClick={onUpdate} fill>
              Update
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
      {warnModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Unsaved changes</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <p>Do you want to discard the changes?</p>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
            <EuiButton onClick={discardChanges} fill>
              Discard
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </EuiFlyout>
  );
};
