/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useEffect } from 'react';
import { EuiColorPicker, EuiCompressedFormRow, useColorPickerState } from '@elastic/eui';

export interface ColorPickerProps {
  originColor: string;
  label: string;
  selectedLayerConfigId: string;
  setIsUpdateDisabled: Function;
  onColorChange: (color: string) => void;
}

export const ColorPicker = memo(
  ({
    originColor,
    label,
    selectedLayerConfigId,
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
    }, [selectedLayerConfigId]);

    return (
      <EuiCompressedFormRow label={label} fullWidth={true} isInvalid={!!colorErrors} error={colorErrors}>
        <EuiColorPicker
          color={color}
          onChange={setColor}
          isInvalid={!!colorErrors}
          fullWidth={true}
          data-test-subj={label}
        />
      </EuiCompressedFormRow>
    );
  }
);
