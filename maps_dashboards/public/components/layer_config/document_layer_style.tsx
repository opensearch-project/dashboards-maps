/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  EuiColorPicker,
  useColorPickerState,
  EuiFieldNumber,
  EuiFormLabel,
  EuiFormErrorText,
  EuiFlexGrid,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { DocumentLayerSpecification } from '../../model/mapLayerType';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const DocumentLayerStyle = ({ setSelectedLayerConfig, selectedLayerConfig }: Props) => {
  const [fillColor, setFillColor] = useColorPickerState(selectedLayerConfig?.style?.fillColor);
  const [borderColor, setBorderColor] = useColorPickerState(
    selectedLayerConfig?.style?.borderColor
  );
  const [borderThickness, setBorderThickness] = useState<number>(
    selectedLayerConfig?.style?.borderThickness
  );
  const [hasInvalidBorderThickness, setHasInvalidBorderThickness] = useState<boolean>(false);

  useEffect(() => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        fillColor,
      },
    });
  }, [fillColor]);

  useEffect(() => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        borderColor,
      },
    });
  }, [borderColor]);

  const onBorderThicknessChange = (e: any) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        borderThickness: Number(e.target.value),
      },
    });
    setBorderThickness(Number(e.target.value));
  };

  useEffect(() => {
    if (borderThickness < 0 || borderThickness > 100) {
      setHasInvalidBorderThickness(true);
    } else {
      setHasInvalidBorderThickness(false);
    }
  }, [borderThickness]);

  return (
    <EuiFlexGrid columns={1}>
      <EuiFlexItem>
        <EuiFormLabel>Fill color</EuiFormLabel>
        <EuiSpacer size="xs" />
        <EuiColorPicker color={fillColor} onChange={setFillColor} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormLabel>Border color</EuiFormLabel>
        <EuiSpacer size="xs" />
        <EuiColorPicker color={borderColor} onChange={setBorderColor} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormLabel>Border thickness</EuiFormLabel>
        <EuiSpacer size="xs" />
        <EuiFieldNumber
          placeholder="Select border thickness"
          value={borderThickness}
          onChange={onBorderThicknessChange}
          isInvalid={hasInvalidBorderThickness}
          append={<EuiFormLabel>px</EuiFormLabel>}
        />
        {hasInvalidBorderThickness && (
          <EuiFormErrorText>
            <FormattedMessage
              id="maps.documents.style.borderThickness.errorMessage"
              defaultMessage="Must between 0 and 100"
            />
          </EuiFormErrorText>
        )}
      </EuiFlexItem>
    </EuiFlexGrid>
  );
};
