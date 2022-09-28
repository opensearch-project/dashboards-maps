/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiListGroupItem,
  EuiButtonEmpty,
  EuiHorizontalRule,
  EuiButton,
} from '@elastic/eui';
import { I18nProvider } from '@osd/i18n/react';
import './layer_control_panel.scss';
import { AddLayerPanel } from '../add_layer_panel';
import { LayerConfigPanel } from '../layer_config';
import { LAYER_TYPE } from '../../../common';
import { ILayerConfig } from '../../model/ILayerConfig';

const LayerControlPanel = () => {
  const [isLayerConfigVisible, setIsLayerConfigVisible] = useState(false);
  const [isLayerControlVisible, setIsLayerControlVisible] = useState(true);
  const [selectedLayerConfig, setSelectedLayerConfig] = useState<ILayerConfig>({
    iconType: '',
    label: '',
    name: '',
    type: '',
    id: '',
  });

  // TODO: replace it once layers model ready
  const demoLayers: ILayerConfig[] = [
    {
      label: 'Base Map',
      iconType: 'visMapRegion',
      id: 'example_id_1',
      type: LAYER_TYPE.BASE_MAP,
      name: 'Base Map Layer',
    },
    {
      label: 'Cluster Layer',
      iconType: 'visMapRegion',
      id: 'example_id_2',
      type: LAYER_TYPE.CLUSTER_MAP,
      name: 'Cluster Layer',
    },
  ];

  if (isLayerControlVisible) {
    return (
      <I18nProvider>
        <EuiPanel paddingSize="none" className="layerControlPanel layerControlPanel--show">
          <EuiFlexGroup
            responsive={false}
            justifyContent="spaceBetween"
            direction="column"
            gutterSize="none"
          >
            <EuiFlexGroup direction="row" alignItems="center">
              <EuiFlexItem className="layerControlPanel__title">
                <EuiTitle size="xs">
                  <h2>Map layers</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  size="s"
                  iconType="menuLeft"
                  onClick={() => setIsLayerControlVisible((visible) => !visible)}
                  aria-label="Hide layer control"
                  color="text"
                  className="layerControlPanel__visButton"
                />
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiHorizontalRule margin="none" />
            {demoLayers.map((layer) => (
              <div key={layer.id}>
                <EuiFlexGroup
                  alignItems="center"
                  gutterSize="none"
                  direction="row"
                  onClick={() => {
                    setSelectedLayerConfig(layer);
                    if (selectedLayerConfig.id === layer.id && isLayerConfigVisible === false) {
                      setIsLayerConfigVisible((visible) => !visible);
                    }
                  }}
                >
                  <EuiFlexItem>
                    <EuiListGroupItem
                      key={layer.id}
                      label={layer.label}
                      data-item={JSON.stringify(layer)}
                      iconType={layer.iconType}
                      aria-label="layer in the map layers list"
                      isDisabled={
                        isLayerConfigVisible &&
                        selectedLayerConfig &&
                        selectedLayerConfig.id === layer.id
                      }
                    />
                  </EuiFlexItem>
                  <EuiFlexGroup justifyContent="flexEnd" gutterSize="none">
                    <EuiFlexItem grow={false} className="layerControlPanel__layerFunctionButton">
                      <EuiButtonEmpty
                        iconType="eyeClosed"
                        size="s"
                        onClick={() => window.alert('Hidden button clicked')}
                        aria-label="Hide or show layer"
                        color="text"
                      />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false} className="layerControlPanel__layerFunctionButton">
                      <EuiButtonEmpty
                        size="s"
                        iconType="trash"
                        onClick={() => window.alert('Delete button clicked')}
                        aria-label="Delete layer"
                        color="text"
                      />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexGroup>
                <EuiHorizontalRule margin="none" />
              </div>
            ))}
            {isLayerConfigVisible && (
              <LayerConfigPanel
                setIsLayerConfigVisible={setIsLayerConfigVisible}
                selectedLayerConfig={selectedLayerConfig}
              />
            )}
            <AddLayerPanel setIsLayerConfigVisible={setIsLayerConfigVisible} />
          </EuiFlexGroup>
        </EuiPanel>
      </I18nProvider>
    );
  }

  return (
    <EuiFlexItem grow={false} className="layerControlPanel layerControlPanel--hide">
      <EuiButton
        className="layerControlPanel__visButton"
        size="s"
        iconType="menuRight"
        iconSide="right"
        onClick={() => setIsLayerControlVisible((visible) => !visible)}
        aria-label="Show layer control"
      >
        Map layers
      </EuiButton>
    </EuiFlexItem>
  );
};

export { LayerControlPanel };
