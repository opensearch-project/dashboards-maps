/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiDualRange, EuiFieldText, EuiForm, EuiFormRow, EuiRange } from '@elastic/eui';
import { MapLayerSpecification } from '../../model/mapLayerType';

interface Props {
  selectedLayerConfig: MapLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const LayerBasicSettings = ({ selectedLayerConfig, setSelectedLayerConfig }: Props) => {
  const onZoomChange = (value: number[]) => {
    setSelectedLayerConfig({ ...selectedLayerConfig, zoomRange: value });
  };

  const onOpacityChange = (e: any) => {
    setSelectedLayerConfig({ ...selectedLayerConfig, opacity: Number(e.target.value) });
  };

  const onNameChange = (e: any) => {
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
          showInput
          minInputProps={{ 'aria-label': 'Min value' }}
          maxInputProps={{ 'aria-label': 'Max value' }}
          onChange={onZoomChange}
          aria-label="DualRange with inputs for zoom level"
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
          aria-label="Range for layer opacity"
        />
      </EuiFormRow>
    </EuiForm>
  );
};
