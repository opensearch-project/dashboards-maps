/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, ChangeEventHandler, ChangeEvent } from 'react';
import {
  EuiFormRow,
  EuiFieldText,
  EuiFlexItem,
  EuiCheckbox,
  EuiSelect,
  EuiFlexGroup,
  EuiFieldNumber,
  EuiFormLabel,
  EuiComboBox,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { EuiComboBoxOptionOption } from '@opensearch-project/oui/src/eui_components/combo_box/types';
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
import { formatFieldStringToComboBox, getFieldsOptions } from '../../../../utils/fields_options';
import { IndexPattern } from '../../../../../../../src/plugins/data/common';
import './label_config.scss';

interface LabelProps {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
}

const labelTitleTypeOptions = [
  {
    value: 'fixed',
    text: i18n.translate('maps.documents.labelFixedTitle', { defaultMessage: 'Fixed' }),
  },
  {
    value: 'by_field',
    text: i18n.translate('maps.documents.labelByFieldTitle', { defaultMessage: 'By field' }),
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
    const { size = 0, enabled } = selectedLayerConfig.style?.label || {};
    return enabled && (size < DOCUMENTS_MIN_LABEL_SIZE || size > DOCUMENTS_MAX_LABEL_SIZE);
  }, [selectedLayerConfig]);

  const invalidLabelTitle = useMemo(() => {
    const label = selectedLayerConfig.style?.label;
    return label && label.enabled
      ? label.titleType === 'by_field'
        ? label.titleByField === ''
        : label.titleByFixed === ''
      : false;
  }, [selectedLayerConfig]);

  useEffect(() => {
    setIsUpdateDisabled(invalidLabelTitle || invalidLabelSize);
  }, [invalidLabelTitle, invalidLabelSize, setIsUpdateDisabled]);

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

  const onChangeLabelTitleType: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>) =>
    onChangeLabel('titleType', event.target.value);

  const onFixedLabelTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeLabel('titleByFixed', String(event.target.value));
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

  const onChangeFieldLabelTitle = (options: EuiComboBoxOptionOption[]) => {
    onChangeLabel('titleByField', options[0]?.label || '');
  };

  const label = selectedLayerConfig.style?.label;

  return (
    <>
      <EuiFormRow>
        <EuiCheckbox
          id="add-label"
          label="Add label"
          checked={label?.enabled ?? false}
          onChange={onChangeShowLabel}
        />
      </EuiFormRow>
      {label?.enabled && (
        <>
          <EuiFormRow
            label={i18n.translate('maps.documents.labelTitle', {
              defaultMessage: 'Label title',
            })}
            isInvalid={invalidLabelTitle}
            error={i18n.translate('maps.documents.titleError', {
              defaultMessage: 'Label title cannot be empty',
            })}
          >
            <EuiFlexGroup responsive={false} alignItems="center" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiSelect
                  options={labelTitleTypeOptions}
                  value={label?.titleType ?? 'fixed'}
                  onChange={onChangeLabelTitleType}
                  disabled={!label?.enabled}
                />
              </EuiFlexItem>
              <EuiFlexItem className={'documentsLabel__title'}>
                {label?.titleType === 'fixed' && (
                  <EuiFieldText
                    placeholder={i18n.translate('maps.documents.labelTitlePlaceholder', {
                      defaultMessage: 'Add label',
                    })}
                    value={label?.titleByFixed ?? ''}
                    onChange={onFixedLabelTitleChange}
                    disabled={!label?.enabled}
                    isInvalid={invalidLabelTitle}
                  />
                )}
                {selectedLayerConfig.style?.label?.titleType === 'by_field' && (
                  <EuiComboBox
                    options={getFieldsOptions(indexPattern)}
                    selectedOptions={formatFieldStringToComboBox(label?.titleByField)}
                    singleSelection={{ asPlainText: true }}
                    onChange={onChangeFieldLabelTitle}
                    sortMatchesBy="startsWith"
                    placeholder={i18n.translate('maps.documents.labelByField', {
                      defaultMessage: 'Select index pattern field',
                    })}
                    fullWidth={true}
                    isClearable={false}
                    isInvalid={invalidLabelTitle}
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
          <EuiFormRow
            label={i18n.translate('maps.documents.labelBorderWidth', {
              defaultMessage: 'Label border width',
            })}
          >
            <EuiSelect
              options={labelBorderWidthOptions}
              value={label?.borderWidth ?? DOCUMENTS_NONE_LABEL_BORDER_WIDTH}
              onChange={onChangeLabelBorderWidth}
              disabled={!label?.enabled}
              fullWidth={true}
            />
          </EuiFormRow>
        </>
      )}
    </>
  );
};
