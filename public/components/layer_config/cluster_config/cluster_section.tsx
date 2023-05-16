import React, { useEffect, useMemo } from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiForm,
  EuiComboBox,
  EuiFormRow,
  EuiCheckbox,
  EuiFieldText,
  EuiAccordion,
  EuiComboBoxOptionOption,
  EuiText,
  EuiLink,
} from '@elastic/eui';
import { formatFieldStringToComboBox, getFieldsOptions } from '../../../utils/fields_options';
import { IndexPattern } from '../../../../../../src/plugins/data/public';
import { i18n } from '@osd/i18n';
import { JsonEditor } from './json_editor';
import { ClusterAggregations, ClusterDocLink } from './config';
import { ClusterLayerSpecification } from 'public/model/mapLayerType';
import { useCallback } from 'react';
import { useState } from 'react';
import { CanUpdateMapType } from './cluster_layer_source';

interface Props {
  indexPattern: IndexPattern | null | undefined;
  selectedLayerConfig: ClusterLayerSpecification;
  setSelectedLayerConfig: Function;
  setCanUpdateMap: React.Dispatch<React.SetStateAction<CanUpdateMapType>>;
}

export const ClusterSection = ({
  indexPattern,
  selectedLayerConfig,
  setSelectedLayerConfig,
  setCanUpdateMap,
}: Props) => {
  const aggOptions = ClusterAggregations.map(({ label, value }) => ({
    label,
    value,
  }));
  const [isJsonValid, setJsonValid] = useState(true);
  const acceptedFieldTypes = ['geo_point', 'geo_shape'];
  const geoFields = useMemo(() => {
    return indexPattern?.fields.filter((field) => acceptedFieldTypes.indexOf(field.type) !== -1);
  }, [indexPattern]);

  const selectedField = useMemo(() => {
    return geoFields?.find((field) => field.name === selectedLayerConfig.source.cluster.field);
  }, [geoFields, selectedLayerConfig]);

  const isFieldValid = useMemo(() => {
    return !!selectedLayerConfig.source.cluster.field;
  }, [selectedLayerConfig]);

  const handleAggChange = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const value = selectedOptions[0].value;
    handleClusterAggChange('agg', value!);
  };

  useEffect(() => {
    //if index is changed, reset field
    handleClusterAggChange('field', '');
  }, [indexPattern]);

  useEffect(() => {
    const canUpdate = isFieldValid && isJsonValid;
    setCanUpdateMap((prev) => ({
      ...prev,
      cluster: canUpdate,
    }));
  }, [isJsonValid, isFieldValid]);

  const handleClusterAggChange = useCallback(
    (key: string, value: string | boolean) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source: {
          ...selectedLayerConfig.source,
          cluster: {
            ...selectedLayerConfig.source.cluster,
            [key]: value,
          },
        },
      });
    },
    [selectedLayerConfig]
  );

  return (
    <EuiPanel paddingSize="s">
      <EuiTitle size="xs">
        <h3>Cluster</h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiForm style={{ padding: '0px 12px' }}>
        <EuiFormRow
          label="Geoaggregation"
          labelAppend={
            <EuiText size="xs">
              <EuiLink href={ClusterDocLink} target="_blank">
                {selectedLayerConfig.source.cluster.agg} help
              </EuiLink>
            </EuiText>
          }
        >
          <EuiComboBox
            placeholder="Select a single option"
            singleSelection={{ asPlainText: true }}
            options={aggOptions}
            selectedOptions={aggOptions.filter(
              (agg) => agg.value === selectedLayerConfig.source.cluster.agg
            )}
            onChange={handleAggChange}
            isClearable={false}
            compressed
          />
        </EuiFormRow>
        <EuiFormRow
          label="Geospatial field"
          isInvalid={!isFieldValid}
          data-test-subj={'clusterFieldSelect'}
          fullWidth={true}
        >
          <EuiComboBox
            options={getFieldsOptions(indexPattern, acceptedFieldTypes)}
            selectedOptions={formatFieldStringToComboBox(selectedField?.displayName)}
            singleSelection={true}
            onChange={(option) => {
              const field = indexPattern?.getFieldByName(option[0]?.label);
              handleClusterAggChange('field', field?.displayName ?? '');
            }}
            sortMatchesBy="startsWith"
            placeholder={i18n.translate('documentLayer.selectDataFieldPlaceholder', {
              defaultMessage: 'Select data field',
            })}
            data-test-subj={'geoFieldSelect'}
            fullWidth={true}
            isClearable={false}
            compressed
          />
        </EuiFormRow>
        <EuiFormRow fullWidth={true}>
          <EuiCheckbox
            id="geocentroid"
            label="Place markers off grid (use geocentroid)"
            onChange={(e) => handleClusterAggChange('useCentroid', e.target.checked)}
            checked={selectedLayerConfig.source.cluster.useCentroid}
            compressed
          />
        </EuiFormRow>
        {selectedLayerConfig.source.cluster.agg === 'geohash' ? (
          <EuiFormRow fullWidth={true}>
            <EuiCheckbox
              id="changePrecision"
              label="Change precision on map zoom"
              onChange={(e) => handleClusterAggChange('changePrecision', e.target.checked)}
              checked={selectedLayerConfig.source.cluster.changePrecision}
              compressed
            />
          </EuiFormRow>
        ) : null}

        <EuiFormRow label="Custom label" isInvalid={false} fullWidth={true}>
          <EuiFieldText
            value={selectedLayerConfig.source.cluster.custom_label}
            onChange={(e) => handleClusterAggChange('custom_label', e.target.value)}
            compressed
          />
        </EuiFormRow>
        <EuiSpacer size="s" />
        <EuiAccordion id="advanced" buttonContent="Advanced" initialIsOpen={!isJsonValid}>
          <EuiFormRow isInvalid={false} fullWidth={true}>
            <JsonEditor
              value={selectedLayerConfig.source.cluster.json}
              setValue={(value) => handleClusterAggChange('json', value)}
              setValidity={setJsonValid}
            />
          </EuiFormRow>
        </EuiAccordion>
      </EuiForm>
    </EuiPanel>
  );
};
