/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useEffect, useState } from 'react';
import {
  EuiColorPicker,
  EuiFieldNumber,
  EuiFormLabel,
  EuiFormErrorText,
  EuiFlexItem,
  EuiSpacer,
  EuiButtonGroup,
  EuiPanel,
  EuiTitle,
  EuiFormRow,
  EuiForm,
  useColorPickerState,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
}

interface ColorPickerProps {
  color: string;
  setColor: (text: string, { isValid }: { isValid: boolean }) => void;
  label: string;
  colorError: (text: string, { isValid }: { isValid: boolean }) => void;
}

const ColorPicker = memo(({ color, setColor, label, colorError }: ColorPickerProps) => {
  return (
    <EuiFormRow label={label} fullWidth={true} isInvalid={!!colorError} error={colorError}>
      <EuiColorPicker color={color} onChange={setColor} isInvalid={!!colorError} fullWidth={true} />
    </EuiFormRow>
  );
});

export const DocumentLayerStyle = ({
  setSelectedLayerConfig,
  selectedLayerConfig,
  setIsUpdateDisabled,
}: Props) => {
  const [fillColor, setFillColor, fillColorErrors] = useColorPickerState(
    selectedLayerConfig?.style?.fillColor
  );
  const [borderColor, setBorderColor, borderColorErrors] = useColorPickerState(
    selectedLayerConfig?.style?.borderColor
  );
  const [hasInvalidThickness, setHasInvalidThickness] = useState<boolean>(false);
  const [hasInvalidSize, setHasInvalidSize] = useState<boolean>(false);
  const geoTypeToggleButtonGroupPrefix = 'geoTypeToggleButtonGroup';
  const [toggleGeoTypeIdSelected, setToggleGeoTypeIdSelected] = useState(
    `${geoTypeToggleButtonGroupPrefix}__Point`
  );

  // It's used to update the style color when switch layer config between different document layers
  useEffect(() => {
    setFillColor(
      selectedLayerConfig?.style?.fillColor,
      !!fillColorErrors ? { isValid: false } : { isValid: true }
    );
    setBorderColor(
      selectedLayerConfig?.style?.borderColor,
      !!borderColorErrors ? { isValid: false } : { isValid: true }
    );
  }, [selectedLayerConfig.id]);

  useEffect(() => {
    const disableUpdate =
      !!fillColorErrors || !!borderColorErrors || hasInvalidSize || hasInvalidThickness;
    setIsUpdateDisabled(disableUpdate);
  }, [
    setIsUpdateDisabled,
    fillColorErrors,
    borderColorErrors,
    hasInvalidSize,
    hasInvalidThickness,
  ]);

  useEffect(() => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        fillColor,
        borderColor,
      },
    });
  }, [fillColor, borderColor]);

  const onBorderThicknessChange = (e: any) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        borderThickness: Number(e.target.value),
      },
    });
  };

  const onMarkerSizeChange = (e: any) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        markerSize: Number(e.target.value),
      },
    });
  };

  useEffect(() => {
    const borderThickness = selectedLayerConfig?.style?.borderThickness;
    const invalidThickness = borderThickness < 0 || borderThickness > 100;
    setHasInvalidThickness(invalidThickness);
  }, [selectedLayerConfig?.style?.borderThickness]);

  useEffect(() => {
    const markerSize = selectedLayerConfig?.style?.markerSize;
    const invalidSize = markerSize < 0 || markerSize > 100;
    setHasInvalidSize(invalidSize);
  }, [selectedLayerConfig?.style?.markerSize]);

  const toggleButtonsGeoType = [
    {
      id: `${geoTypeToggleButtonGroupPrefix}__Point`,
      label: 'Points',
    },
    {
      id: `${geoTypeToggleButtonGroupPrefix}__Line`,
      label: 'Lines',
    },
    {
      id: `${geoTypeToggleButtonGroupPrefix}__Polygon`,
      label: 'Polygons',
    },
  ];

  const onChangeGeoTypeSelected = (optionId: string) => {
    setToggleGeoTypeIdSelected(optionId);
  };

  interface WidthSelectorProps {
    size: number;
    onWidthChange: Function;
    label: string;
    hasInvalid: boolean;
  }

  const WidthSelector = ({ label, onWidthChange, size, hasInvalid }: WidthSelectorProps) => {
    return (
      <EuiFormRow label={label} fullWidth={true}>
        <EuiFlexItem>
          <EuiFieldNumber
            placeholder="Select thickness"
            value={size}
            onChange={onWidthChange}
            isInvalid={hasInvalid}
            append={<EuiFormLabel>px</EuiFormLabel>}
            fullWidth={true}
          />
          {hasInvalid && (
            <EuiFormErrorText>
              <FormattedMessage
                id="maps.documents.style.thickness.errorMessage"
                defaultMessage="Must between 0 and 100"
              />
            </EuiFormErrorText>
          )}
        </EuiFlexItem>
      </EuiFormRow>
    );
  };

  return (
    <EuiPanel paddingSize="m">
      <EuiTitle size="xs">
        <h2>Layer style</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiButtonGroup
        name="DocumentLayerStyleGroupButton"
        legend="Group button of layer style"
        options={toggleButtonsGeoType}
        idSelected={toggleGeoTypeIdSelected}
        onChange={(id) => onChangeGeoTypeSelected(id)}
        buttonSize="compressed"
      />
      <EuiSpacer size="s" />
      <EuiForm>
        {toggleGeoTypeIdSelected === `${geoTypeToggleButtonGroupPrefix}__Point` && (
          <EuiForm>
            <ColorPicker
              color={fillColor}
              setColor={setFillColor}
              label="Fill color"
              colorError={fillColorErrors}
            />
            <ColorPicker
              color={borderColor}
              setColor={setBorderColor}
              label="Border color"
              colorError={borderColorErrors}
            />
            <WidthSelector
              label="Border thickness"
              size={selectedLayerConfig?.style?.borderThickness}
              onWidthChange={onBorderThicknessChange}
              hasInvalid={hasInvalidThickness}
            />
            <WidthSelector
              label="Marker size"
              size={selectedLayerConfig?.style?.markerSize}
              onWidthChange={onMarkerSizeChange}
              hasInvalid={hasInvalidSize}
            />
          </EuiForm>
        )}
        {toggleGeoTypeIdSelected === `${geoTypeToggleButtonGroupPrefix}__Line` && (
          <EuiForm>
            <ColorPicker
              color={fillColor}
              setColor={setFillColor}
              label="Fill color"
              colorError={fillColorErrors}
            />
            <WidthSelector
              label="Border thickness"
              size={selectedLayerConfig?.style?.borderThickness}
              onWidthChange={onBorderThicknessChange}
              hasInvalid={hasInvalidThickness}
            />
          </EuiForm>
        )}
        {toggleGeoTypeIdSelected === `${geoTypeToggleButtonGroupPrefix}__Polygon` && (
          <EuiForm>
            <ColorPicker
              color={fillColor}
              setColor={setFillColor}
              label="Fill color"
              colorError={fillColorErrors}
            />
            <ColorPicker
              color={borderColor}
              setColor={setBorderColor}
              label="Border color"
              colorError={borderColorErrors}
            />
            <WidthSelector
              label="Border thickness"
              size={selectedLayerConfig?.style?.borderThickness}
              onWidthChange={onBorderThicknessChange}
              hasInvalid={hasInvalidThickness}
            />
          </EuiForm>
        )}
      </EuiForm>
    </EuiPanel>
  );
};
