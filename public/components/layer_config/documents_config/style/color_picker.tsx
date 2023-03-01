/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useEffect } from 'react';
import { EuiColorPicker, EuiFormRow, useColorPickerState } from '@elastic/eui';
import { DocumentLayerSpecification } from '../../../../model/mapLayerType';

export interface ColorPickerProps {
  originColor: string;
  label: string;
  selectedLayerConfig: DocumentLayerSpecification;
  setIsUpdateDisabled: Function;
  onColorChange: (color: string) => void;
}

export const ColorPicker = memo(
  ({
    originColor,
    label,
    selectedLayerConfig,
    setIsUpdateDisabled,
    onColorChange,
  }: ColorPickerProps) => {
    const [color, setColor, colorErrors] = useColorPickerState(originColor);

    useEffect(() => {
      onColorChange(String(color));
    }, [color]);

    useEffect(() => {
      setIsUpdateDisabled(!!colorErrors);
    }, [colorErrors]);

    // It's used to update the style color when switch layer config between different document layers
    useEffect(() => {
      setColor(originColor, !!colorErrors ? { isValid: false } : { isValid: true });
    }, [selectedLayerConfig.id]);

    return (
      <EuiFormRow label={label} fullWidth={true} isInvalid={!!colorErrors} error={colorErrors}>
        <EuiColorPicker
          color={color}
          onChange={setColor}
          isInvalid={!!colorErrors}
          fullWidth={true}
          data-test-subj={label}
        />
      </EuiFormRow>
    );
  }
);
