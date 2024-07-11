/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  EuiDualRange,
  EuiCompressedFieldText,
  EuiForm,
  EuiCompressedFormRow,
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
import { ValueMember } from '../../../../../src/plugins/opensearch_dashboards_react/public/validated_range/validated_dual_range';

interface Props {
  selectedLayerConfig: MapLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  isLayerExists: Function;
}

export const LayerBasicSettings = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
  setIsUpdateDisabled,
  isLayerExists,
}: Props) => {
  const [invalid, setInvalid] = useState<boolean>(selectedLayerConfig.name.length === 0);
  const [errors, setErrors] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState<[ValueMember, ValueMember]>(selectedLayerConfig.zoomRange as [ValueMember, ValueMember]);

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
    if (isLayerExists(name)) {
      setInvalid(true);
      setErrors(['Name already exists']);
      return;
    }
    setInvalid(false);
    return;
  };

  const { name } = selectedLayerConfig;

  useEffect(() => {
    const disableUpdate = !name || invalid;
    setIsUpdateDisabled(disableUpdate);
  }, [setIsUpdateDisabled, name, invalid]);

  const commonUpdate = (key: string, value: any) => {
    const newLayerConfig = { ...selectedLayerConfig, [key]: value };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onZoomChange = (value: [ValueMember, ValueMember]) => {
    // if value is not empty string, then update the zoom level to layer config
    if (value[0] !== '' && value[1] !== '') {
      // change value to number type
      commonUpdate('zoomRange', value.map((zoomLevel) => Number(zoomLevel)));
    }
    setZoomLevel(value);
  };

  const onOpacityChange = (e: any) => {
    commonUpdate('opacity', Number(e.target.value));
  };

  const onNameChange = (e: any) => {
    const layerName = String(e.target.value);
    validateName(layerName);
    commonUpdate('name', layerName);
  };

  const onDescriptionChange = (e: any) => {
    commonUpdate('description', String(e.target.value));
  };

  return (
    <EuiPanel paddingSize="m">
      <EuiTitle size="xs">
        <h2>Layer settings</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiForm>
        <EuiCompressedFormRow label="Name" error={errors} isInvalid={invalid} fullWidth={true}>
          <EuiCompressedFieldText
            name="layerName"
            value={selectedLayerConfig.name}
            onChange={onNameChange}
            isInvalid={invalid}
            fullWidth={true}
          />
        </EuiCompressedFormRow>

        <EuiCompressedFormRow label="Description" fullWidth={true}>
          <EuiTextArea
            placeholder="Enter description"
            value={selectedLayerConfig.description}
            onChange={onDescriptionChange}
            fullWidth={true}
          />
        </EuiCompressedFormRow>

        <EuiCompressedFormRow label="Zoom levels" fullWidth={true}>
          <EuiDualRange
            min={MAP_DEFAULT_MIN_ZOOM}
            max={MAP_DEFAULT_MAX_ZOOM}
            value={zoomLevel}
            showInput
            minInputProps={{ 'aria-label': 'Min value' }}
            maxInputProps={{ 'aria-label': 'Max value' }}
            onChange={onZoomChange}
            aria-label="DualRange with inputs for zoom level"
            fullWidth={true}
          />
        </EuiCompressedFormRow>
        <EuiCompressedFormRow label="Opacity" fullWidth={true}>
          <EuiRange
            min={MAP_LAYER_DEFAULT_MIN_OPACITY}
            max={MAP_LAYER_DEFAULT_MAX_OPACITY}
            step={MAP_LAYER_DEFAULT_OPACITY_STEP}
            value={selectedLayerConfig.opacity}
            onChange={onOpacityChange}
            showInput
            aria-label="Range for layer opacity"
            append={<EuiFormLabel>%</EuiFormLabel>}
            fullWidth={true}
          />
        </EuiCompressedFormRow>
      </EuiForm>
    </EuiPanel>
  );
};
