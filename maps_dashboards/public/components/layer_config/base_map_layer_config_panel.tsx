/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiTitle, EuiSpacer } from '@elastic/eui';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { LayerBasicSettings } from './layer_basic_settings';

interface Props {
  selectedLayerConfig: MapLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const BaseMapLayerConfigPanel = ({ selectedLayerConfig, setSelectedLayerConfig }: Props) => {
  return (
    <div>
      <EuiTitle size="xs">
        <h2>Layer settings</h2>
      </EuiTitle>
      <EuiSpacer size="s" />
      <LayerBasicSettings
        selectedLayerConfig={selectedLayerConfig}
        setSelectedLayerConfig={setSelectedLayerConfig}
      />
    </div>
  );
};
