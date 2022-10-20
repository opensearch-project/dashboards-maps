/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiForm, EuiFormRow, EuiFieldText, EuiDualRange, EuiRange } from '@elastic/eui';
import { ILayerConfig } from '../../model/ILayerConfig';

interface Props {
  selectedLayerConfig: ILayerConfig;
  setSelectedLayerConfig: Function;
}

export const BaseMapLayerConfigPanel = ({ selectedLayerConfig, setSelectedLayerConfig }: Props) => {
  const onZoomChange = (value: number[]) => {
    setSelectedLayerConfig({ ...selectedLayerConfig, zoomRange: value });
  };

  const onOpacityChange = (e) => {
    setSelectedLayerConfig({ ...selectedLayerConfig, opacity: Number(e.target.value) });
  };

  const onNameChange = (e) => {
    setSelectedLayerConfig({ ...selectedLayerConfig, name: String(e.target.value) });
  };

  return (
    <EuiForm>
      <EuiFormRow label="Name">
        <EuiFieldText name="first" value={selectedLayerConfig.name} onChange={onNameChange} />
      </EuiFormRow>
      <EuiFormRow label="Zoom">
        <EuiDualRange
          min={0}
          max={22}
          value={selectedLayerConfig.zoomRange}
          onChange={onZoomChange}
          showInput
          minInputProps={{ 'aria-label': 'Min value' }}
          maxInputProps={{ 'aria-label': 'Max value' }}
          aria-label="EuiDualRange with inputs for zoom level"
        />
      </EuiFormRow>
      <EuiFormRow label="Opacity">
        <EuiRange
          min={0}
          max={1}
          step={0.1}
          value={selectedLayerConfig.opacity}
          onChange={onOpacityChange}
          showInput
          aria-label="EuiRange for layer opacity"
        />
      </EuiFormRow>
    </EuiForm>
  );
};
