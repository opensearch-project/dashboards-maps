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
  EuiFlexItem,
  EuiSpacer,
  EuiButtonGroup,
  EuiPanel,
  EuiTitle,
  EuiFormRow,
  EuiForm,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const DocumentLayerStyle = ({ setSelectedLayerConfig, selectedLayerConfig }: Props) => {
  const [fillColor, setFillColor] = useState(selectedLayerConfig?.style?.fillColor);
  const [borderColor, setBorderColor] = useState(selectedLayerConfig?.style?.borderColor);
  const [hasInvalidThickness, setHasInvalidThickness] = useState<boolean>(false);
  const [hasInvalidSize, setHasInvalidSize] = useState<boolean>(false);
  const geoTypeToggleButtonGroupPrefix = 'geoTypeToggleButtonGroup';
  const [toggleGeoTypeIdSelected, setToggleGeoTypeIdSelected] = useState(
    `${geoTypeToggleButtonGroupPrefix}__Point`
  );

  useEffect(() => {
    setFillColor(selectedLayerConfig?.style?.fillColor);
    setBorderColor(selectedLayerConfig?.style?.borderColor);
  }, [selectedLayerConfig]);

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
    if (
      selectedLayerConfig?.style?.borderThickness < 0 ||
      selectedLayerConfig?.style?.borderThickness > 100
    ) {
      setHasInvalidThickness(true);
    } else {
      setHasInvalidThickness(false);
    }
  }, [selectedLayerConfig?.style?.borderThickness]);

  useEffect(() => {
    if (
      selectedLayerConfig?.style?.markerSize < 0 ||
      selectedLayerConfig?.style?.markerSize > 100
    ) {
      setHasInvalidSize(true);
    } else {
      setHasInvalidSize(false);
    }
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

  interface ColorPickerProps {
    color: string;
    setColor: Function;
    label: string;
  }

  const ColorPicker = ({ color, setColor, label }: ColorPickerProps) => {
    return (
      <EuiFormRow label={label}>
        <EuiColorPicker
          color={color}
          onChange={setColor}
          isInvalid={false}
          onBlur={() => {}}
          fullWidth={true}
        />
      </EuiFormRow>
    );
  };

  interface WidthSelectorProps {
    size: number;
    onWidthChange: Function;
    label: string;
    hasInvalid: boolean;
  }

  const WidthSelector = ({ label, onWidthChange, size, hasInvalid }: WidthSelectorProps) => {
    return (
      <EuiFormRow label={label}>
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
            <ColorPicker color={fillColor} setColor={setFillColor} label="Fill color" />
            <ColorPicker color={borderColor} setColor={setBorderColor} label="Border color" />
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
            <ColorPicker color={fillColor} setColor={setFillColor} label="Fill color" />
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
            <ColorPicker color={fillColor} setColor={setFillColor} label="Fill color" />
            <ColorPicker color={borderColor} setColor={setBorderColor} label="Border color" />
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
