/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, ChangeEventHandler, ChangeEvent } from 'react';
import {
  EuiCompressedFormRow,
  EuiCompressedFieldText,
  EuiFlexItem,
  EuiCompressedCheckbox,
  EuiCompressedSelect,
  EuiFlexGroup,
  EuiCompressedFieldNumber,
  EuiFormLabel,
  EuiCompressedComboBox,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { EuiComboBoxOptionOption } from '@opensearch-project/oui/src/eui_components/combo_box/types';
import { DocumentLayerSpecification } from '../../../../model/mapLayerType';
import { ColorPicker } from './color_picker';
import {
  DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR,
  DOCUMENTS_DEFAULT_LABEL_COLOR,
  DOCUMENTS_DEFAULT_LABEL_SIZE,
  DOCUMENTS_DEFAULT_LABEL_TEXT_TYPE,
  DOCUMENTS_LABEL_TEXT_TYPE,
  DOCUMENTS_LARGE_LABEL_BORDER_WIDTH,
  DOCUMENTS_MAX_LABEL_SIZE,
  DOCUMENTS_MEDIUM_LABEL_BORDER_WIDTH,
  DOCUMENTS_MIN_LABEL_SIZE,
  DOCUMENTS_NONE_LABEL_BORDER_WIDTH,
  DOCUMENTS_SMALL_LABEL_BORDER_WIDTH,
} from '../../../../../common';
import { formatFieldStringToComboBox, getFieldsOptions } from '../../../../utils/fields_options';
import { IndexPattern } from '../../../../../../../src/plugins/data/common';
import './label_config.scss';

interface LabelProps {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
}

const labelTextTypeOptions = [
  {
    value: DOCUMENTS_LABEL_TEXT_TYPE.FIXED,
    text: i18n.translate('maps.documents.labelFixedText', { defaultMessage: 'Fixed' }),
  },
  {
    value: DOCUMENTS_LABEL_TEXT_TYPE.BY_FIELD,
    text: i18n.translate('maps.documents.labelByFieldText', { defaultMessage: 'Field value' }),
  },
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

export const LabelConfig = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
  setIsUpdateDisabled,
  indexPattern,
}: LabelProps) => {
  const invalidLabelSize = useMemo(() => {
    const { size = DOCUMENTS_DEFAULT_LABEL_SIZE, enabled } = selectedLayerConfig.style?.label || {};
    return enabled && (size < DOCUMENTS_MIN_LABEL_SIZE || size > DOCUMENTS_MAX_LABEL_SIZE);
  }, [selectedLayerConfig]);

  const invalidLabelText = useMemo(() => {
    const {
      enabled,
      textType = DOCUMENTS_DEFAULT_LABEL_TEXT_TYPE,
      textByField = '',
      textByFixed = '',
    } = selectedLayerConfig.style?.label || {};

    return (
      enabled &&
      (textType === DOCUMENTS_LABEL_TEXT_TYPE.BY_FIELD ? textByField === '' : textByFixed === '')
    );
  }, [selectedLayerConfig]);

  useEffect(() => {
    setIsUpdateDisabled(invalidLabelText || invalidLabelSize);
  }, [invalidLabelText, invalidLabelSize, setIsUpdateDisabled]);

  const onChangeLabel = (propName: string, propValue: boolean | number | string) => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style?.label,
          [propName]: propValue,
        },
      },
    });
  };

  const onChangeShowLabel = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeLabel('enabled', Boolean(event.target.checked));
  };

  const onChangeLabelTextType: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>) =>
    onChangeLabel('textType', event.target.value);

  const onFixedLabelTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeLabel('textByFixed', String(event.target.value));
  };

  const OnChangeLabelSize = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeLabel('size', Number(event.target.value));
  };

  const onChangeLabelBorderWidth: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeLabel('borderWidth', Number(event.target.value));
  };

  const onChangeLabelBorderColor = (color: string) => {
    onChangeLabel('borderColor', color);
  };

  const onChangeLabelColor = (color: string) => {
    onChangeLabel('color', color);
  };

  const onChangeLabelFieldText = (options: EuiComboBoxOptionOption[]) => {
    const newSelectedLayerConfig = {
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig.style,
        label: {
          ...selectedLayerConfig.style?.label,
          textByField: options[0]?.label || '',
          // For backwards compatibility, set textType to BY_FIELD if textByField is set
          textType: DOCUMENTS_LABEL_TEXT_TYPE.BY_FIELD,
        },
      },
    };
    setSelectedLayerConfig(newSelectedLayerConfig);
  };

  const label = selectedLayerConfig.style?.label;

  return (
    <>
      <EuiCompressedFormRow>
        <EuiCompressedCheckbox
          id="show-label"
          label="Add label"
          checked={label?.enabled ?? false}
          onChange={onChangeShowLabel}
        />
      </EuiCompressedFormRow>
      {label?.enabled && (
        <>
          <EuiCompressedFormRow
            label={i18n.translate('maps.documents.labelText', {
              defaultMessage: 'Label text',
            })}
            isInvalid={invalidLabelText}
            error={i18n.translate('maps.documents.textError', {
              defaultMessage: 'Label text cannot be empty',
            })}
          >
            <EuiFlexGroup responsive={false} alignItems="center" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiCompressedSelect
                  options={labelTextTypeOptions}
                  value={label?.textType ?? DOCUMENTS_DEFAULT_LABEL_TEXT_TYPE}
                  onChange={onChangeLabelTextType}
                />
              </EuiFlexItem>
              <EuiFlexItem className={'documentsLabel__text'}>
                {label?.textType === DOCUMENTS_LABEL_TEXT_TYPE.FIXED && (
                  <EuiCompressedFieldText
                    placeholder={i18n.translate('maps.documents.labelTextPlaceholder', {
                      defaultMessage: 'Enter label text',
                    })}
                    value={label?.textByFixed ?? ''}
                    onChange={onFixedLabelTextChange}
                    isInvalid={invalidLabelText}
                  />
                )}
                {(!label?.textType || label?.textType === DOCUMENTS_LABEL_TEXT_TYPE.BY_FIELD) && (
                  <EuiCompressedComboBox
                    options={getFieldsOptions(indexPattern)}
                    selectedOptions={formatFieldStringToComboBox(label?.textByField)}
                    singleSelection={{ asPlainText: true }}
                    onChange={onChangeLabelFieldText}
                    sortMatchesBy="startsWith"
                    placeholder={i18n.translate('maps.documents.labelByField', {
                      defaultMessage: 'Select index pattern field',
                    })}
                    fullWidth={true}
                    isClearable={false}
                    isInvalid={invalidLabelText}
                  />
                )}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiCompressedFormRow>
          <EuiCompressedFormRow
            label={i18n.translate('maps.documents.labelSize', {
              defaultMessage: 'Label size',
            })}
            isInvalid={invalidLabelSize}
            error={i18n.translate('maps.documents.labelSizeError', {
              defaultMessage: `Must be between ${DOCUMENTS_MIN_LABEL_SIZE} and ${DOCUMENTS_MAX_LABEL_SIZE}`,
            })}
          >
            <EuiCompressedFieldNumber
              placeholder={i18n.translate('maps.documents.labelSizePlaceholder', {
                defaultMessage: 'Select size',
              })}
              value={label?.size ?? DOCUMENTS_DEFAULT_LABEL_SIZE}
              onChange={OnChangeLabelSize}
              append={<EuiFormLabel>px</EuiFormLabel>}
              fullWidth={true}
              min={DOCUMENTS_MIN_LABEL_SIZE}
              max={DOCUMENTS_MAX_LABEL_SIZE}
            />
          </EuiCompressedFormRow>
          <ColorPicker
            originColor={label?.color ?? DOCUMENTS_DEFAULT_LABEL_COLOR}
            label={i18n.translate('maps.documents.labelColor', {
              defaultMessage: 'Label color',
            })}
            selectedLayerConfigId={selectedLayerConfig.id}
            setIsUpdateDisabled={setIsUpdateDisabled}
            onColorChange={onChangeLabelColor}
          />
          <ColorPicker
            originColor={label?.borderColor ?? DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR}
            label={'Label border color'}
            selectedLayerConfigId={selectedLayerConfig.id}
            setIsUpdateDisabled={setIsUpdateDisabled}
            onColorChange={onChangeLabelBorderColor}
          />
          <EuiCompressedFormRow
            label={i18n.translate('maps.documents.labelBorderWidth', {
              defaultMessage: 'Label border width',
            })}
          >
            <EuiCompressedSelect
              options={labelBorderWidthOptions}
              value={label?.borderWidth ?? DOCUMENTS_NONE_LABEL_BORDER_WIDTH}
              onChange={onChangeLabelBorderWidth}
              fullWidth={true}
            />
          </EuiCompressedFormRow>
        </>
      )}
    </>
  );
};
