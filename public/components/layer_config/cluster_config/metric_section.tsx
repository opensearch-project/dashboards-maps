import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  EuiForm,
  EuiFieldText,
  EuiAccordion,
  EuiComboBoxOptionOption,
  EuiLink,
  EuiText,
  EuiFlexGrid,
  EuiFlexItem,
  EuiCompressedFormRow,
  EuiCompressedComboBox,
} from '@elastic/eui';
import { formatFieldStringToComboBox, getFieldsOptions } from '../../../utils/fields_options';
import { IndexPattern } from '../../../../../../src/plugins/data/public';
import { i18n } from '@osd/i18n';
import { JsonEditor } from './json_editor';
import { MetricAggregations, MetricDocLink } from './config';
import { ClusterLayerSpecification } from 'public/model/mapLayerType';
import { CanUpdateMapType } from './cluster_layer_source';

interface Props {
  indexPattern: IndexPattern | null | undefined;
  selectedLayerConfig: ClusterLayerSpecification;
  setSelectedLayerConfig: Function;
  setCanUpdateMap: React.Dispatch<React.SetStateAction<CanUpdateMapType>>;
}

export const MetricSection = ({
                                indexPattern,
                                selectedLayerConfig,
                                setSelectedLayerConfig,
                                setCanUpdateMap,
                              }: Props) => {
  const aggOptions = MetricAggregations.map(({ label, value }) => ({
    label,
    value,
  }));
  const [isJsonValid, setJsonValid] = useState(true);

  const acceptedFieldTypes = useMemo(() => {
    const aggValue = selectedLayerConfig.source.metric.agg;
    const agg = MetricAggregations.find((agg) => agg.value === aggValue);
    return agg!.acceptedFieldTypes as unknown as string[];
  }, [selectedLayerConfig]);

  const supportedFields = useMemo(() => {
    return indexPattern?.fields.filter((field) => acceptedFieldTypes.indexOf(field.type) !== -1);
  }, [indexPattern, acceptedFieldTypes]);

  const selectedField = useMemo(() => {
    return supportedFields?.find((field) => field.name === selectedLayerConfig.source.metric.field);
  }, [supportedFields, selectedLayerConfig]);

  const isFieldValid = useMemo(() => {
    //count agg does'nt need field
    return (
      selectedLayerConfig.source.metric.agg === 'count' || !!selectedLayerConfig.source.metric.field
    );
  }, [selectedLayerConfig]);

  useEffect(() => {
    const canUpdate =
      //If metric agg type is count,json can be invalid,
      isFieldValid && (isJsonValid || selectedLayerConfig.source.metric.agg === 'count');
    setCanUpdateMap((prev) => ({
      ...prev,
      metric: canUpdate,
    }));
  }, [isJsonValid, isFieldValid, selectedLayerConfig]);

  const onAggTypeChange = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const value = selectedOptions[0].value;
    handleMetricAggChange({ agg: value! });
  };

  useEffect(() => {
    //if index is changed, reset field
    handleMetricAggChange({ field: '', fieldType: '' });
  }, [indexPattern]);

  const onFieldChange = (option: EuiComboBoxOptionOption<string>[]) => {
    const field = indexPattern?.getFieldByName(option[0]?.label);
    handleMetricAggChange({ field: field?.displayName ?? '', fieldType: field?.type ?? '' });
  };

  const handleMetricAggChange = useCallback(
    (object: Record<string, string | boolean>) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source: {
          ...selectedLayerConfig.source,
          metric: {
            ...selectedLayerConfig.source.metric,
            ...object,
          },
        },
      });
    },
    [selectedLayerConfig]
  );

  const docLinkInfo = useMemo(() => {
    const aggValue = selectedLayerConfig.source.metric.agg;
    const agg = MetricAggregations.find((agg) => agg.value === aggValue);
    return {
      label: agg!.label,
      link: MetricDocLink,
    };
  }, [selectedLayerConfig]);

  return (
    <EuiForm>
      <EuiFlexGrid columns={1}>
        <EuiFlexItem>
          <EuiCompressedFormRow
            label={i18n.translate('metricSection.aggretedBy', {
              defaultMessage: 'Aggregated by',
            })}
            labelAppend={
              <EuiText size="xs">
                <EuiLink href={docLinkInfo.link} target="_blank">
                  {docLinkInfo.label} help
                </EuiLink>
              </EuiText>
            }
          >
            <EuiCompressedComboBox
              singleSelection={{ asPlainText: true }}
              options={aggOptions}
              selectedOptions={aggOptions.filter(
                (agg) => agg.value === selectedLayerConfig.source.metric.agg
              )}
              onChange={onAggTypeChange}
              isClearable={false}
              compressed
            />
          </EuiCompressedFormRow>
        </EuiFlexItem>
        {selectedLayerConfig.source.metric.agg !== 'count' && (
          <EuiFlexItem>
            <EuiCompressedFormRow
              label="Field"
              isInvalid={!isFieldValid}
              data-test-subj={'metricFieldSelect'}
              fullWidth={true}
              error={'Required'}
            >
              <EuiCompressedComboBox
                options={getFieldsOptions(indexPattern, acceptedFieldTypes)}
                selectedOptions={formatFieldStringToComboBox(selectedField?.displayName)}
                singleSelection={true}
                isInvalid={!isFieldValid}
                onChange={onFieldChange}
                sortMatchesBy="startsWith"
                placeholder={i18n.translate('metricSection.selectDataFieldPlaceholder', {
                  defaultMessage: 'Select field',
                })}
                data-test-subj={'metricFieldSelect'}
                fullWidth={true}
                isClearable={false}
                compressed
              />
            </EuiCompressedFormRow>
          </EuiFlexItem>
        )}
        <EuiFlexItem>
          <EuiCompressedFormRow label="Custom label" fullWidth={true}>
            <EuiFieldText
              value={selectedLayerConfig.source.metric.custom_label}
              onChange={(e) => handleMetricAggChange({ custom_label: e.target.value })}
              compressed
              placeholder={i18n.translate('metricSection.addCustomLabel', {
                defaultMessage: 'Add a custom label',
              })}
            />
          </EuiCompressedFormRow>
        </EuiFlexItem>
        {selectedLayerConfig.source.metric.agg !== 'count' && (
          <EuiFlexItem>
            <EuiAccordion id="advanced" buttonContent="Advanced" initialIsOpen={!isJsonValid}>
              <EuiCompressedFormRow fullWidth={true}>
                <JsonEditor
                  value={selectedLayerConfig.source.metric.json}
                  setValue={(value) => handleMetricAggChange({ json: value })}
                  setValidity={setJsonValid}
                />
              </EuiCompressedFormRow>
            </EuiAccordion>
          </EuiFlexItem>
        )}
      </EuiFlexGrid>
    </EuiForm>
  );
};
