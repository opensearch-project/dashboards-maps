/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiDualRange,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiRange,
  EuiFormLabel,
} from '@elastic/eui';
import { MapLayerSpecification } from '../../model/mapLayerType';
import {
  MAP_DEFAULT_MIN_ZOOM,
  MAP_DEFAULT_MAX_ZOOM,
  MAP_LAYER_DEFAULT_MIN_OPACITY,
  MAP_LAYER_DEFAULT_MAX_OPACITY,
  MAP_LAYER_DEFAULT_OPACITY_STEP,
} from '../../../common';

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
        <EuiFieldText name="layerName" value={selectedLayerConfig.name} onChange={onNameChange} />
      </EuiFormRow>
      <EuiFormRow label="Zoom">
        <EuiDualRange
          min={MAP_DEFAULT_MIN_ZOOM}
          max={MAP_DEFAULT_MAX_ZOOM}
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
          min={MAP_LAYER_DEFAULT_MIN_OPACITY}
          max={MAP_LAYER_DEFAULT_MAX_OPACITY}
          step={MAP_LAYER_DEFAULT_OPACITY_STEP}
          value={selectedLayerConfig.opacity}
          onChange={onOpacityChange}
          showInput
          aria-label="Range for layer opacity"
          append={<EuiFormLabel>%</EuiFormLabel>}
        />
      </EuiFormRow>
    </EuiForm>
  );
};
