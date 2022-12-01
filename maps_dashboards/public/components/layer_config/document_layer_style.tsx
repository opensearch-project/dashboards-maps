/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { EuiFormRow, EuiColorPicker, useColorPickerState } from '@elastic/eui';
import { DocumentLayerSpecification } from '../../model/mapLayerType';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const DocumentLayerStyle = ({ setSelectedLayerConfig, selectedLayerConfig }: Props) => {
  const [color, setColor, errors] = useColorPickerState(
    selectedLayerConfig?.style?.fillColor || '#D36086'
  );
  useEffect(() => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        fillColor: color,
      },
    });
  }, [color]);

  return (
    <EuiFormRow label="Point color" isInvalid={!!errors} error={errors}>
      <EuiColorPicker onChange={setColor} color={color} />
    </EuiFormRow>
  );
};
