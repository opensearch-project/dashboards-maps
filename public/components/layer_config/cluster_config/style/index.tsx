/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  EuiFieldNumber,
  EuiFormLabel,
  EuiSpacer,
  EuiColorPicker,
  EuiPanel,
  EuiFormRow,
  EuiRadioGroup,
  EuiColorPalettePicker,
  EuiForm,
  EuiTitle,
  euiPaletteColorBlind,
  euiPaletteForTemperature,
  EuiDualRange,
  euiPaletteForStatus,
  EuiColorPalettePickerPaletteProps,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { ClusterLayerSpecification } from '../../../../model/mapLayerType';
import { CLUSTER_MIN_BORDER_THICKNESS, CLUSTER_MAX_BORDER_THICKNESS } from '../../../../../common';
import {
  CLUSTER_MIN_DEFAULT_RADIUS_SIZE,
  CLUSTER_MAX_DEFAULT_RADIUS_SIZE,
} from '../../../../../common';
interface Props {
  selectedLayerConfig: ClusterLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
}

export const ClusterLayerStyle = ({
  setSelectedLayerConfig,
  selectedLayerConfig,
  setIsUpdateDisabled,
}: Props) => {
  const [hasInvalidBorderThickness, setHasInvalidBorderThickness] = useState(false);

  const fillTypeOptions = [
    {
      id: 'gradient',
      label: 'ramp gradient',
    },
    { id: 'solid', label: 'solid color' },
  ];
  //TODO: wait designer provide palette props
  const palettes: EuiColorPalettePickerPaletteProps[] = [
    {
      value: 'pallette_1',
      palette: euiPaletteColorBlind(),
      type: 'gradient',
    },
    {
      value: 'pallette_2',
      palette: euiPaletteForStatus(5),
      type: 'gradient',
    },
    {
      value: 'pallette_3',
      palette: euiPaletteForTemperature(5),
      type: 'gradient',
    },
    {
      value: 'pallette_4',
      palette: [
        {
          stop: 100,
          color: 'white',
        },
        {
          stop: 250,
          color: 'lightgray',
        },
        {
          stop: 320,
          color: 'gray',
        },
        {
          stop: 470,
          color: 'black',
        },
      ],
      type: 'gradient',
    },
  ];

  const onPaletteChange = (palette: string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        palette,
      },
    });
  };
  const onColorPickerChange = (fillColor: string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        fillColor,
      },
    });
  };

  useEffect(() => {
    const borderThickness = selectedLayerConfig.style.borderThickness;
    const invalidThickness =
      borderThickness < CLUSTER_MIN_BORDER_THICKNESS ||
      borderThickness > CLUSTER_MAX_BORDER_THICKNESS;
    setHasInvalidBorderThickness(invalidThickness);
  }, [selectedLayerConfig.style.borderThickness]);

  useEffect(() => {
    const disableUpdate = hasInvalidBorderThickness;
    setIsUpdateDisabled(disableUpdate);
  }, [hasInvalidBorderThickness]);

  const onFillTypeChange = (fillType: string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        fillType,
      },
    });
  };

  const onRadiusRangeChange = (radiusRange: [string | number, string | number]) => {
    const [min, max] = radiusRange;
    const isValueInValid = (value: string | number) =>
      Number(value) < CLUSTER_MIN_DEFAULT_RADIUS_SIZE ||
      Number(value) > CLUSTER_MAX_DEFAULT_RADIUS_SIZE;
    const validRange = [
      isValueInValid(min) ? CLUSTER_MIN_DEFAULT_RADIUS_SIZE : Number(min),
      isValueInValid(max) ? CLUSTER_MAX_DEFAULT_RADIUS_SIZE : Number(max),
    ];
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        radiusRange: validRange,
      },
    });
  };

  const onBorderColorChange = (borderColor: string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        borderColor,
      },
    });
  };
  const onBorderThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        borderThickness: Number(e.target.value),
      },
    });
  };

  return (
    <>
      <EuiPanel paddingSize="s">
        <EuiTitle size="xxs">
          <h4>Layer style</h4>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiForm>
          <EuiRadioGroup
            options={fillTypeOptions}
            idSelected={selectedLayerConfig.style.fillType}
            onChange={onFillTypeChange}
            name="fill type radio group"
            legend={{
              children: <span>Fill type</span>,
            }}
          />
          <EuiSpacer size="m" />
          {selectedLayerConfig.style.fillType === 'gradient' ? (
            <EuiFormRow label="Ramp fill">
              <EuiColorPalettePicker
                palettes={palettes}
                onChange={onPaletteChange}
                valueOfSelected={selectedLayerConfig.style.palette}
                selectionDisplay={'palette'}
              />
            </EuiFormRow>
          ) : (
            <EuiFormRow label="Color fill">
              <EuiColorPicker
                onChange={onColorPickerChange}
                color={selectedLayerConfig.style.fillColor}
              />
            </EuiFormRow>
          )}

          <EuiFormRow label="Radius Size" fullWidth={true}>
            <EuiDualRange
              min={CLUSTER_MIN_DEFAULT_RADIUS_SIZE}
              max={CLUSTER_MAX_DEFAULT_RADIUS_SIZE}
              value={selectedLayerConfig.style.radiusRange}
              showInput
              minInputProps={{ 'aria-label': 'Min value' }}
              maxInputProps={{ 'aria-label': 'Max value' }}
              onChange={onRadiusRangeChange}
              aria-label="DualRange with inputs for radius size"
              fullWidth={true}
            />
          </EuiFormRow>
          <EuiFormRow
            label={i18n.translate('maps.cluster.symbolBorderColor', {
              defaultMessage: 'Border color',
            })}
            fullWidth={true}
          >
            <EuiColorPicker
              color={selectedLayerConfig?.style?.borderColor}
              onChange={onBorderColorChange}
              fullWidth={true}
              data-test-subj="Border color"
            />
          </EuiFormRow>

          <EuiFormRow
            label={i18n.translate('maps.cluster.symbolBorderThickness', {
              defaultMessage: 'Border thickness',
            })}
            fullWidth={true}
            isInvalid={hasInvalidBorderThickness}
          >
            <EuiFieldNumber
              placeholder="Select thickness"
              value={selectedLayerConfig.style.borderThickness}
              onChange={onBorderThicknessChange}
              append={<EuiFormLabel>px</EuiFormLabel>}
              fullWidth={true}
              isInvalid={hasInvalidBorderThickness}
              min={CLUSTER_MIN_BORDER_THICKNESS}
              max={CLUSTER_MAX_BORDER_THICKNESS}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiPanel>
      <EuiSpacer size="m" />
    </>
  );
};
