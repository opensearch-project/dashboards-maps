/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  EuiFieldNumber,
  EuiFormLabel,
  EuiSpacer,
  EuiButtonGroup,
  EuiPanel,
  EuiCompressedFormRow,
  EuiForm,
  EuiCollapsibleNavGroup,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { DocumentLayerSpecification } from '../../../../model/mapLayerType';
import {
  DOCUMENTS_MAX_MARKER_BORDER_THICKNESS,
  DOCUMENTS_MAX_MARKER_SIZE,
  DOCUMENTS_MIN_MARKER_BORDER_THICKNESS,
  DOCUMENTS_MIN_MARKER_SIZE,
} from '../../../../../common';
import { LabelConfig } from './label_config';
import { ColorPicker } from './color_picker';
import { IndexPattern } from '../../../../../../../src/plugins/data/common';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
}

export const DocumentLayerStyle = ({
  setSelectedLayerConfig,
  selectedLayerConfig,
  setIsUpdateDisabled,
  indexPattern,
}: Props) => {
  const [hasInvalidThickness, setHasInvalidThickness] = useState<boolean>(false);
  const [hasInvalidSize, setHasInvalidSize] = useState<boolean>(false);
  const geoTypeToggleButtonGroupPrefix = 'geoTypeToggleButtonGroup';
  const [toggleGeoTypeIdSelected, setToggleGeoTypeIdSelected] = useState(
    `${geoTypeToggleButtonGroupPrefix}__Point`
  );

  useEffect(() => {
    const disableUpdate = hasInvalidSize || hasInvalidThickness;
    setIsUpdateDisabled(disableUpdate);
  }, [hasInvalidSize, hasInvalidThickness]);

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
    const invalidThickness =
      borderThickness < DOCUMENTS_MIN_MARKER_BORDER_THICKNESS ||
      borderThickness > DOCUMENTS_MAX_MARKER_BORDER_THICKNESS;
    setHasInvalidThickness(invalidThickness);
  }, [selectedLayerConfig?.style?.borderThickness]);

  useEffect(() => {
    const markerSize = selectedLayerConfig?.style?.markerSize;
    const invalidSize =
      markerSize < DOCUMENTS_MIN_MARKER_SIZE || markerSize > DOCUMENTS_MAX_MARKER_SIZE;
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
    onWidthChange: (event: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    hasInvalid: boolean;
    min: number;
    max: number;
  }

  const WidthSelector = ({
    label,
    onWidthChange,
    size,
    hasInvalid,
    min,
    max,
  }: WidthSelectorProps) => {
    return (
      <EuiCompressedFormRow
        label={label}
        fullWidth={true}
        isInvalid={hasInvalid}
        error={i18n.translate('maps.documents.style.invalidWidth', {
          defaultMessage: `must be between ${min} and ${max}`,
        })}
      >
        <EuiFieldNumber
          placeholder="Select thickness"
          value={size}
          onChange={onWidthChange}
          isInvalid={hasInvalid}
          append={<EuiFormLabel>px</EuiFormLabel>}
          fullWidth={true}
          min={min}
          max={max}
        />
      </EuiCompressedFormRow>
    );
  };

  const onFillColorChange = (fillColor: string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        fillColor,
      },
    });
  };

  const onBorderColorChange = (borderColor: string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        borderColor,
      },
    });
  };

  return (
    <>
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Layer style"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={true}
        >
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
                  originColor={selectedLayerConfig?.style?.fillColor}
                  label={i18n.translate('maps.documents.symbolFillColor', {
                    defaultMessage: 'Fill color',
                  })}
                  selectedLayerConfigId={selectedLayerConfig.id}
                  setIsUpdateDisabled={setIsUpdateDisabled}
                  onColorChange={onFillColorChange}
                />
                <ColorPicker
                  originColor={selectedLayerConfig?.style?.borderColor}
                  label={i18n.translate('maps.documents.symbolBorderColor', {
                    defaultMessage: 'Border color',
                  })}
                  selectedLayerConfigId={selectedLayerConfig.id}
                  setIsUpdateDisabled={setIsUpdateDisabled}
                  onColorChange={onBorderColorChange}
                />
                <WidthSelector
                  label={i18n.translate('maps.documents.symbolBorderThickness', {
                    defaultMessage: 'Border thickness',
                  })}
                  size={selectedLayerConfig?.style?.borderThickness}
                  onWidthChange={onBorderThicknessChange}
                  hasInvalid={hasInvalidThickness}
                  min={DOCUMENTS_MIN_MARKER_BORDER_THICKNESS}
                  max={DOCUMENTS_MAX_MARKER_BORDER_THICKNESS}
                />
                <WidthSelector
                  label={i18n.translate('maps.documents.symbolMarkerSize', {
                    defaultMessage: 'Marker size',
                  })}
                  size={selectedLayerConfig?.style?.markerSize}
                  onWidthChange={onMarkerSizeChange}
                  hasInvalid={hasInvalidSize}
                  min={DOCUMENTS_MIN_MARKER_SIZE}
                  max={DOCUMENTS_MAX_MARKER_SIZE}
                />
              </EuiForm>
            )}
            {toggleGeoTypeIdSelected === `${geoTypeToggleButtonGroupPrefix}__Line` && (
              <EuiForm>
                <ColorPicker
                  originColor={selectedLayerConfig?.style?.fillColor}
                  label={i18n.translate('maps.documents.symbolFillColor', {
                    defaultMessage: 'Fill color',
                  })}
                  selectedLayerConfigId={selectedLayerConfig.id}
                  setIsUpdateDisabled={setIsUpdateDisabled}
                  onColorChange={onFillColorChange}
                />
                <WidthSelector
                  label={i18n.translate('maps.documents.symbolBorderColor', {
                    defaultMessage: 'Border color',
                  })}
                  size={selectedLayerConfig?.style?.borderThickness}
                  onWidthChange={onBorderThicknessChange}
                  hasInvalid={hasInvalidThickness}
                  min={DOCUMENTS_MIN_MARKER_BORDER_THICKNESS}
                  max={DOCUMENTS_MAX_MARKER_BORDER_THICKNESS}
                />
              </EuiForm>
            )}
            {toggleGeoTypeIdSelected === `${geoTypeToggleButtonGroupPrefix}__Polygon` && (
              <EuiForm>
                <ColorPicker
                  originColor={selectedLayerConfig?.style?.fillColor}
                  label={i18n.translate('maps.documents.symbolFillColor', {
                    defaultMessage: 'Fill color',
                  })}
                  selectedLayerConfigId={selectedLayerConfig.id}
                  setIsUpdateDisabled={setIsUpdateDisabled}
                  onColorChange={onFillColorChange}
                />
                <ColorPicker
                  originColor={selectedLayerConfig?.style?.borderColor}
                  label={i18n.translate('maps.documents.symbolBorderColor', {
                    defaultMessage: 'Border color',
                  })}
                  selectedLayerConfigId={selectedLayerConfig.id}
                  setIsUpdateDisabled={setIsUpdateDisabled}
                  onColorChange={onBorderColorChange}
                />
                <WidthSelector
                  label={i18n.translate('maps.documents.symbolBorderThickness', {
                    defaultMessage: 'Border thickness',
                  })}
                  size={selectedLayerConfig?.style?.borderThickness}
                  onWidthChange={onBorderThicknessChange}
                  hasInvalid={hasInvalidThickness}
                  min={DOCUMENTS_MIN_MARKER_BORDER_THICKNESS}
                  max={DOCUMENTS_MAX_MARKER_BORDER_THICKNESS}
                />
              </EuiForm>
            )}
          </EuiForm>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Label"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={selectedLayerConfig.style.label?.enabled ?? false}
        >
          <LabelConfig
            selectedLayerConfig={selectedLayerConfig}
            setSelectedLayerConfig={setSelectedLayerConfig}
            setIsUpdateDisabled={setIsUpdateDisabled}
            indexPattern={indexPattern}
          />
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
    </>
  );
};
