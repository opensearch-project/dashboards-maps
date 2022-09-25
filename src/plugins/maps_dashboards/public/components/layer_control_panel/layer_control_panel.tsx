/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiListGroupItem,
  EuiButtonEmpty,
  EuiHorizontalRule,
} from '@elastic/eui';
import { I18nProvider } from '@osd/i18n/react';
import './layer_control_panel.scss';
import { AddLayerPanel } from '../add_layer_panel';

const LayerControlPanel = () => {
  // TODO: replace it once layers model ready
  const demoLayers = [
    {
      label: 'Base Map',
      iconType: 'visMapRegion',
    },
    {
      label: 'GeoJson Layer',
      iconType: 'visMapRegion',
    },
  ];

  return (
    <I18nProvider>
      <EuiPanel paddingSize="none" className="layerControlPanel">
        <EuiFlexGroup
          responsive={false}
          justifyContent="spaceBetween"
          direction="column"
          gutterSize="none"
        >
          <EuiFlexItem className="layerControlPanel__title">
            <EuiTitle size="xs">
              <h2>Map Layers</h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiHorizontalRule margin="none" />
          {demoLayers.map((layer) => (
            <div>
              <EuiFlexGroup alignItems="center" gutterSize="none" direction="row">
                <EuiFlexItem>
                  <EuiListGroupItem
                    key={layer.label}
                    label={layer.label}
                    data-item={JSON.stringify(layer)}
                    iconType={layer.iconType}
                    aria-label="layer in the map layers list"
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
          <AddLayerPanel />
        </EuiFlexGroup>
      </EuiPanel>
    </I18nProvider>
  );
};

export { LayerControlPanel };
