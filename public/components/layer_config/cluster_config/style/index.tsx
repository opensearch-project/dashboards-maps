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
  EuiFlexGroup,
  EuiColorPalettePicker,
  EuiForm,
  EuiTitle,
  EuiSelect,
  EuiFlexItem,
  EuiColorPalettePickerPaletteProps,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { ClusterLayerSpecification } from '../../../../model/mapLayerType';
import { CLUSTER_MIN_BORDER_THICKNESS, CLUSTER_MAX_BORDER_THICKNESS } from '../../../../../common';
import { Palettes } from '../config';

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
      value: 'gradient',
      text: 'Gradient',
    },
    { value: 'solid', text: 'Solid' },
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

  const onFillTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        fillType: e.target.value,
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
          <EuiFormRow
            label={i18n.translate('maps.cluster.fillColor', {
              defaultMessage: 'Fill color',
            })}
          >
            <>
              <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    id="selectDocExample"
                    options={fillTypeOptions}
                    value={selectedLayerConfig.style.fillType}
                    onChange={onFillTypeChange}
                    aria-label="Use aria labels when no actual label is in use"
                    fullWidth={false}
                  />
                </EuiFlexItem>

                <EuiFlexItem>
                  {selectedLayerConfig.style.fillType === 'gradient' ? (
                    <EuiColorPalettePicker
                      palettes={Palettes as EuiColorPalettePickerPaletteProps[]}
                      onChange={onPaletteChange}
                      valueOfSelected={selectedLayerConfig.style.palette}
                      selectionDisplay={'palette'}
                    />
                  ) : (
                    <EuiColorPicker
                      onChange={onColorPickerChange}
                      color={selectedLayerConfig.style.fillColor}
                    />
                  )}
                </EuiFlexItem>
              </EuiFlexGroup>
            </>
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
