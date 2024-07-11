/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { cloneDeep, isEqual } from 'lodash';

import {
  EuiSmallButton,
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
  EuiIcon,
  EuiSpacer,
} from '@elastic/eui';

import { MapLayerSpecification } from '../../model/mapLayerType';
import { BaseMapLayerConfigPanel } from './index';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';
import { DocumentLayerConfigPanel } from './documents_config/document_layer_config_panel';
import { layersTypeIconMap, layersTypeNameMap } from '../../model/layersFunctions';
import { CustomMapConfigPanel } from './custom_map_config/custom_map_config_panel';

interface Props {
  closeLayerConfigPanel: Function;
  selectedLayerConfig: MapLayerSpecification;
  setSelectedLayerConfig: Function;
  updateLayer: Function;
  removeLayer: Function;
  isNewLayer: boolean;
  setIsNewLayer: Function;
  isLayerExists: Function;
  originLayerConfig: MapLayerSpecification | null;
  setOriginLayerConfig: Function;
  setIsUpdatingLayerRender: (isUpdatingLayerRender: boolean) => void;
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
  originLayerConfig,
  setOriginLayerConfig,
  setIsUpdatingLayerRender,
}: Props) => {
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false);

  useEffect(() => {
    if (originLayerConfig === null || originLayerConfig.id !== selectedLayerConfig.id) {
      setOriginLayerConfig(cloneDeep(selectedLayerConfig));
    }
  }, [originLayerConfig, selectedLayerConfig]);

  const discardChanges = () => {
    closeLayerConfigPanel(false);
    setSelectedLayerConfig(undefined);
    setOriginLayerConfig(null);
    setUnsavedModalVisible(false);
  };

  const onClose = () => {
    if (isEqual(originLayerConfig, selectedLayerConfig)) {
      discardChanges();
    } else {
      setUnsavedModalVisible(true);
    }
    if (isNewLayer) {
      removeLayer(selectedLayerConfig.id);
      setIsNewLayer(false);
    }
  };
  const onUpdate = () => {
    setIsUpdatingLayerRender(true);
    updateLayer();
    closeLayerConfigPanel(false);
    setOriginLayerConfig(null);
    if (isNewLayer) {
      setIsNewLayer(false);
    }
  };

  const closeModal = () => {
    setUnsavedModalVisible(false);
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
        <EuiFlexGroup gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiIcon type={layersTypeIconMap[selectedLayerConfig.type]} size="m" />
          </EuiFlexItem>
          <EuiFlexItem>
            <strong>{selectedLayerConfig.name}</strong>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="s" />
        <EuiFlexGroup gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <small>Type: {layersTypeNameMap[selectedLayerConfig.type]}</small>
          </EuiFlexItem>
        </EuiFlexGroup>
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
            {selectedLayerConfig.type === DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP && (
              <CustomMapConfigPanel
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
            <EuiSmallButton
              disabled={isUpdateDisabled}
              iconType="play"
              onClick={onUpdate}
              fill
              data-test-subj="updateButton"
            >
              Update
            </EuiSmallButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
      {unsavedModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Unsaved changes</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <p>Do you want to discard the changes?</p>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
            <EuiSmallButton onClick={discardChanges} fill>
              Discard
            </EuiSmallButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </EuiFlyout>
  );
};
