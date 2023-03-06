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
    if (selectedLayerConfig.style?.label?.enabled) {
      if (selectedLayerConfig.style.label?.tittleType === 'fixed') {
        if (selectedLayerConfig.style.label?.tittle === '') {
          setInValidLabelTittle(true);
        } else {
          setInValidLabelTittle(false);
        }
      }
      if (
        selectedLayerConfig.style?.label?.size < DOCUMENTS_MIN_LABEL_SIZE ||
        selectedLayerConfig.style?.label?.size > DOCUMENTS_MAX_LABEL_SIZE
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

  const onChangeShowLabel = (e: any) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          enabled: Boolean(e.target.checked),
        },
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelTittleType = (e: any) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          tittleType: String(e.target.value),
        },
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onStaticLabelTittleChange = (e: { target: { value: any } }) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          tittle: String(e.target.value),
        },
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const OnChangeLabelSize = (e: { target: { value: any } }) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          size: Number(e.target.value),
        },
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelBorderWidth = (e: any) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          borderWidth: Number(e.target.value),
        },
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelBorderColor = (color: string) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          borderColor: color,
        },
      },
    };
    setSelectedLayerConfig(newLayerConfig);
  };

  const onChangeLabelColor = (color: string) => {
    const newLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style.label,
          color,
        },
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
          checked={selectedLayerConfig.style?.label?.enabled ?? false}
          onChange={onChangeShowLabel}
        />
      </EuiFormRow>
      {selectedLayerConfig.style?.label?.enabled && (
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
                  value={selectedLayerConfig.style?.label?.tittleType ?? 'fixed'}
                  onChange={onChangeLabelTittleType}
                  disabled={!selectedLayerConfig.style?.label?.enabled}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={true}>
                {selectedLayerConfig.style?.label?.tittleType === 'fixed' && (
                  <EuiFieldText
                    placeholder={i18n.translate('maps.documents.labelTittlePlaceholder', {
                      defaultMessage: 'Add label',
                    })}
                    value={selectedLayerConfig.style?.label?.tittle ?? ''}
                    onChange={onStaticLabelTittleChange}
                    disabled={!selectedLayerConfig.style?.label?.enabled}
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
              value={selectedLayerConfig.style?.label?.size ?? DOCUMENTS_DEFAULT_LABEL_SIZE}
              onChange={OnChangeLabelSize}
              append={<EuiFormLabel>px</EuiFormLabel>}
              fullWidth={true}
              min={DOCUMENTS_MIN_LABEL_SIZE}
              max={DOCUMENTS_MAX_LABEL_SIZE}
            />
          </EuiFormRow>
          <ColorPicker
            originColor={selectedLayerConfig.style.label.color ?? DOCUMENTS_DEFAULT_LABEL_COLOR}
            label={i18n.translate('maps.documents.labelColor', {
              defaultMessage: 'Label color',
            })}
            selectedLayerConfigId={selectedLayerConfig.id}
            setIsUpdateDisabled={setIsUpdateDisabled}
            onColorChange={onChangeLabelColor}
          />
          <ColorPicker
            originColor={
              selectedLayerConfig.style?.label?.borderColor ?? DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR
            }
            label={'Label border color'}
            selectedLayerConfigId={selectedLayerConfig.id}
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
                selectedLayerConfig.style?.label?.borderWidth ?? DOCUMENTS_NONE_LABEL_BORDER_WIDTH
              }
              onChange={onChangeLabelBorderWidth}
              disabled={!selectedLayerConfig.style?.label?.enabled}
              fullWidth={true}
            />
          </EuiFormRow>
        </>
      )}
    </>
  );
};
