/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiDualRange,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiTitle,
  EuiSpacer,
  EuiRange,
  EuiPanel,
  EuiFormLabel,
  EuiTextArea,
} from '@elastic/eui';
import { MapLayerSpecification } from '../../model/mapLayerType';
import {
  MAP_DEFAULT_MIN_ZOOM,
  MAP_DEFAULT_MAX_ZOOM,
  MAP_LAYER_DEFAULT_MIN_OPACITY,
  MAP_LAYER_DEFAULT_MAX_OPACITY,
  MAP_LAYER_DEFAULT_OPACITY_STEP,
  MAX_LAYER_NAME_LIMIT,
} from '../../../common';
import { layersTypeNameMap } from '../../model/layersFunctions';

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

  const [invalid, setInvalid] = useState<boolean>(selectedLayerConfig.name.length === 0);
  const [errors, setErrors] = useState<string[]>([]);

  const validateName = (name: string) => {
    if (name?.length === 0) {
      setInvalid(true);
      setErrors(['Name cannot be empty']);
      return;
    }
    if (MAX_LAYER_NAME_LIMIT < name?.length) {
      setInvalid(true);
      setErrors(['Name should be less than ' + MAX_LAYER_NAME_LIMIT + ' characters']);
      return;
    }
    setInvalid(false);
  };

  const onNameChange = (e: any) => {
    const layerName = String(e.target.value);
    setSelectedLayerConfig({ ...selectedLayerConfig, name: layerName });
    validateName(layerName);
  };

  const onDescriptionChange = (e: any) => {
    setSelectedLayerConfig({ ...selectedLayerConfig, description: String(e.target.value) });
  };

  return (
    <EuiPanel paddingSize="m">
      <EuiTitle size="xs">
        <h2>Layer settings</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiForm>
        <EuiFormRow label="Type">
          <EuiFieldText
            name="layerType"
            value={layersTypeNameMap[selectedLayerConfig.type]}
            readOnly={true}
          />
        </EuiFormRow>
        <EuiFormRow label="Name" error={errors} isInvalid={invalid}>
          <EuiFieldText
            name="layerName"
            value={selectedLayerConfig.name}
            onChange={onNameChange}
            isInvalid={invalid}
          />
        </EuiFormRow>

        <EuiFormRow label="Description">
          <EuiTextArea
            placeholder="Enter description"
            value={selectedLayerConfig.description}
            onChange={onDescriptionChange}
          />
        </EuiFormRow>

        <EuiFormRow label="Zoom levels">
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
    </EuiPanel>
  );
};
