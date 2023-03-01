/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  EuiFormRow,
  EuiFieldText,
  EuiFlexItem,
  EuiCheckbox,
  EuiSelect,
  EuiFlexGroup,
  EuiFieldNumber,
  EuiFormLabel,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { DocumentLayerSpecification } from '../../../../model/mapLayerType';
import { ColorPicker } from './color_picker';
import {
  DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR,
  DOCUMENTS_DEFAULT_LABEL_COLOR,
  DOCUMENTS_DEFAULT_LABEL_SIZE,
  DOCUMENTS_LARGE_LABEL_BORDER_WIDTH,
  DOCUMENTS_MAX_LABEL_SIZE,
  DOCUMENTS_MEDIUM_LABEL_BORDER_WIDTH,
  DOCUMENTS_MIN_LABEL_SIZE,
  DOCUMENTS_NONE_LABEL_BORDER_WIDTH,
  DOCUMENTS_SMALL_LABEL_BORDER_WIDTH,
} from '../../../../../common';

interface LabelProps {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
}

export const LabelConfig = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
  setIsUpdateDisabled,
}: LabelProps) => {
  const labelTittleTypeOptions = [
    {
      value: 'fixed',
      text: i18n.translate('maps.documents.label.fixedTittle', { defaultMessage: 'Fixed' }),
    },
    // TODO: add support for using index pattern field as label
  ];

  const labelBorderWidthOptions = [
    {
      value: DOCUMENTS_NONE_LABEL_BORDER_WIDTH,
      text: i18n.translate('maps.documents.labelNoneBorderWidth', {
        defaultMessage: 'None',
      }),
    },
    {
      value: DOCUMENTS_SMALL_LABEL_BORDER_WIDTH,
      text: i18n.translate('maps.documents.labelSmallBorderWidth', {
        defaultMessage: 'Small',
      }),
    },
    {
      value: DOCUMENTS_MEDIUM_LABEL_BORDER_WIDTH,
      text: i18n.translate('maps.documents.labelMediumBorderWidth', {
        defaultMessage: 'Medium',
      }),
    },
    {
      value: DOCUMENTS_LARGE_LABEL_BORDER_WIDTH,
      text: i18n.translate('maps.documents.labelLargeBorderWidth', {
        defaultMessage: 'Large',
      }),
    },
  ];

  const [inValidLabelTittle, setInValidLabelTittle] = React.useState(false);
  const [invalidLabelSize, setInvalidLabelSize] = React.useState(false);

  useEffect(() => {
    if (selectedLayerConfig.style.enableLabel) {
      if (selectedLayerConfig.style.labelTittleType === 'fixed') {
        if (selectedLayerConfig.style.labelTittle === '') {
          setInValidLabelTittle(true);
        } else {
          setInValidLabelTittle(false);
        }
      }
      if (
        selectedLayerConfig.style.labelSize < DOCUMENTS_MIN_LABEL_SIZE ||
        selectedLayerConfig.style.labelSize > DOCUMENTS_MAX_LABEL_SIZE
      ) {
        setInvalidLabelSize(true);
      } else {
        setInvalidLabelSize(false);
      }
    }
  }, [selectedLayerConfig]);

  useEffect(() => {
    if (inValidLabelTittle || invalidLabelSize) {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
  }, [inValidLabelTittle, invalidLabelSize]);

  const onChangeShowLabel = (e: { target: { checked: any } }) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        enableLabel: Boolean(e.target.checked),
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelTittleType = (e: any) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        labelTittleType: String(e.target.value),
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onStaticLabelChange = (e: { target: { value: any } }) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        labelTittle: String(e.target.value),
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const OnChangeLabelSize = (e: { target: { value: any } }) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        labelSize: Number(e.target.value),
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelBorderWidth = (e: any) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        labelBorderWidth: Number(e.target.value),
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelBorderColor = (color: string) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        labelBorderColor: color,
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelColor = (color: string) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        labelColor: color,
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  return (
    <>
      <EuiFormRow>
        <EuiCheckbox
          id="add-label"
          label="Add label"
          checked={selectedLayerConfig.style?.enableLabel ?? false}
          onChange={onChangeShowLabel}
        />
      </EuiFormRow>
      {selectedLayerConfig.style?.enableLabel && (
        <>
          <EuiFormRow
            label={i18n.translate('maps.documents.labelTittle', {
              defaultMessage: 'Label tittle',
            })}
            isInvalid={inValidLabelTittle}
            error={i18n.translate('maps.documents.tittleError', {
              defaultMessage: 'Label tittle is required',
            })}
          >
            <EuiFlexGroup responsive={false} alignItems="center" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiSelect
                  options={labelTittleTypeOptions}
                  value={selectedLayerConfig.style?.labelTittleType ?? 'fixed'}
                  onChange={onChangeLabelTittleType}
                  disabled={!selectedLayerConfig.style?.enableLabel}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={true}>
                {selectedLayerConfig.style?.labelTittleType === 'fixed' && (
                  <EuiFieldText
                    placeholder={i18n.translate('maps.documents.labelTittlePlaceholder', {
                      defaultMessage: 'Add label',
                    })}
                    value={selectedLayerConfig.style?.labelTittle ?? ''}
                    onChange={onStaticLabelChange}
                    disabled={!selectedLayerConfig.style?.enableLabel}
                    isInvalid={inValidLabelTittle}
                  />
                )}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFormRow>
          <EuiFormRow
            label={i18n.translate('maps.documents.labelSize', {
              defaultMessage: 'Label size',
            })}
            isInvalid={invalidLabelSize}
            error={i18n.translate('maps.documents.labelSizeError', {
              defaultMessage: `Must be between ${DOCUMENTS_MIN_LABEL_SIZE} and ${DOCUMENTS_MAX_LABEL_SIZE}`,
            })}
          >
            <EuiFieldNumber
              placeholder={i18n.translate('maps.documents.labelSizePlaceholder', {
                defaultMessage: 'Select size',
              })}
              value={selectedLayerConfig.style?.labelSize ?? DOCUMENTS_DEFAULT_LABEL_SIZE}
              onChange={OnChangeLabelSize}
              append={<EuiFormLabel>px</EuiFormLabel>}
              fullWidth={true}
              min={DOCUMENTS_MIN_LABEL_SIZE}
              max={DOCUMENTS_MAX_LABEL_SIZE}
            />
          </EuiFormRow>
          <ColorPicker
            originColor={selectedLayerConfig.style.labelColor ?? DOCUMENTS_DEFAULT_LABEL_COLOR}
            label={i18n.translate('maps.documents.labelColor', {
              defaultMessage: 'Label color',
            })}
            selectedLayerConfig={selectedLayerConfig}
            setIsUpdateDisabled={setIsUpdateDisabled}
            onColorChange={onChangeLabelColor}
          />
          <ColorPicker
            originColor={
              selectedLayerConfig.style.labelBorderColor ?? DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR
            }
            label={'Label border color'}
            selectedLayerConfig={selectedLayerConfig}
            setIsUpdateDisabled={setIsUpdateDisabled}
            onColorChange={onChangeLabelBorderColor}
          />
          <EuiFormRow
            label={i18n.translate('maps.documents.labelBorderWidth', {
              defaultMessage: 'Label border width',
            })}
          >
            <EuiSelect
              options={labelBorderWidthOptions}
              value={
                selectedLayerConfig.style?.labelBorderWidth ?? DOCUMENTS_NONE_LABEL_BORDER_WIDTH
              }
              onChange={onChangeLabelBorderWidth}
              disabled={!selectedLayerConfig.style?.enableLabel}
              fullWidth={true}
            />
          </EuiFormRow>
        </>
      )}
    </>
  );
};
