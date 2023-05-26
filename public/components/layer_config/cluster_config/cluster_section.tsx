import React, { useEffect, useMemo, useCallback, useState } from 'react';
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
  EuiRange,
} from '@elastic/eui';
import { formatFieldStringToComboBox, getFieldsOptions } from '../../../utils/fields_options';
import { IndexPattern } from '../../../../../../src/plugins/data/public';
import { i18n } from '@osd/i18n';
import { JsonEditor } from './json_editor';
import { ClusterAggregations, ClusterDocLink, GeoHexDocLink } from './config';
import { ClusterLayerSpecification } from 'public/model/mapLayerType';
import { CanUpdateMapType } from './cluster_layer_source';
import _ from 'lodash';

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
  const acceptedFieldTypes = useMemo(() => {
    const aggValue = selectedLayerConfig.source.cluster.agg;
    const agg = ClusterAggregations.find((agg) => agg.value === aggValue);
    return agg!.acceptedFieldTypes as unknown as string[];
  }, [selectedLayerConfig]);

  const geoFields = useMemo(() => {
    return indexPattern?.fields.filter((field) => acceptedFieldTypes.indexOf(field.type) !== -1);
  }, [indexPattern]);

  const selectedField = useMemo(() => {
    return geoFields?.find((field) => field.name === selectedLayerConfig.source.cluster.field);
  }, [geoFields, selectedLayerConfig]);

  const isFieldValid = useMemo(() => {
    return !!selectedLayerConfig.source.cluster.field;
  }, [selectedLayerConfig]);

  const onAggTypeChange = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const value = selectedOptions[0].value;
    handleClusterAggChange({ agg: value! });
  };

  useEffect(() => {
    //if index is changed, reset field
    handleClusterAggChange({ field: '', fieldType: '' });
  }, [indexPattern]);

  useEffect(() => {
    const canUpdate = isFieldValid && isJsonValid;
    setCanUpdateMap((prev) => ({
      ...prev,
      cluster: canUpdate,
    }));
  }, [isJsonValid, isFieldValid]);

  const onFieldChange = (option: EuiComboBoxOptionOption<string>[]) => {
    const field = indexPattern?.getFieldByName(option[0]?.label);
    const newParams = {
      field: field?.displayName ?? '',
      fieldType: field?.type ?? '',
    };
    handleClusterAggChange(
      //centroid doesn't support geo_shape type field.
      field?.type === 'geo_shape' ? { ...newParams, useCentroid: false } : newParams
    );
  };
  const handleClusterAggChange = useCallback(
    (object: Record<string, string | boolean>) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source: {
          ...selectedLayerConfig.source,
          cluster: {
            ...selectedLayerConfig.source.cluster,
            ...object,
          },
        },
      });
    },
    [selectedLayerConfig]
  );

  const docLinkInfo = useMemo(() => {
    const aggValue = selectedLayerConfig.source.cluster.agg;
    const agg = ClusterAggregations.find((agg) => agg.value === aggValue);
    return {
      label: agg!.label,
      link: aggValue === 'geohex_grid' ? GeoHexDocLink : ClusterDocLink,
    };
  }, [selectedLayerConfig]);

  return (
    <EuiPanel paddingSize="s">
      <EuiTitle size="xs">
        <h3>Cluster</h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiForm style={{ padding: '0px 12px' }}>
        <EuiFormRow
          label="Geoaggregation type"
          labelAppend={
            <EuiText size="xs">
              <EuiLink href={docLinkInfo.link} target="_blank">
                {docLinkInfo.label} help
              </EuiLink>
            </EuiText>
          }
        >
          <EuiComboBox
            singleSelection={{ asPlainText: true }}
            options={aggOptions}
            selectedOptions={aggOptions.filter(
              (agg) => agg.value === selectedLayerConfig.source.cluster.agg
            )}
            onChange={onAggTypeChange}
            isClearable={false}
            compressed
          />
        </EuiFormRow>
        <EuiFormRow
          label="Geospatial field"
          isInvalid={!isFieldValid}
          data-test-subj={'clusterFieldSelect'}
          fullWidth={true}
          error={'Required'}
        >
          <EuiComboBox
            options={getFieldsOptions(indexPattern, acceptedFieldTypes)}
            selectedOptions={formatFieldStringToComboBox(selectedField?.displayName)}
            singleSelection={true}
            onChange={onFieldChange}
            sortMatchesBy="startsWith"
            placeholder={i18n.translate('clusterSection.selectDataFieldPlaceholder', {
              defaultMessage: 'Select field',
            })}
            data-test-subj={'geoFieldSelect'}
            fullWidth={true}
            isClearable={false}
            isInvalid={!isFieldValid}
            compressed
          />
        </EuiFormRow>
        {selectedLayerConfig.source.cluster.agg === 'geohash_grid' ||
        selectedLayerConfig.source.cluster.agg === 'geohex_grid' ? (
          <>
            <EuiFormRow fullWidth={true}>
              <EuiCheckbox
                id="changePrecision"
                label={i18n.translate('clusterSection.changePrecision', {
                  defaultMessage: 'Change precision on map zoom',
                })}
                onChange={(e) => handleClusterAggChange({ changePrecision: e.target.checked })}
                checked={selectedLayerConfig.source.cluster.changePrecision}
                compressed
              />
            </EuiFormRow>
            {!selectedLayerConfig.source.cluster.changePrecision ? (
              <EuiFormRow label="Precision" display={'rowCompressed'}>
                <EuiRange
                  min={1}
                  max={7}
                  value={selectedLayerConfig.source.cluster.precision}
                  onChange={(e) => handleClusterAggChange({ precision: e.currentTarget.value })}
                  showValue
                  compressed
                />
              </EuiFormRow>
            ) : null}
          </>
        ) : null}
        <EuiFormRow fullWidth={true}>
          <EuiCheckbox
            id="geocentroid"
            label={i18n.translate('clusterSection.useGeocentroid', {
              defaultMessage: 'Place markers off grid (use geocentroid)',
            })}
            onChange={(e) => handleClusterAggChange({ useCentroid: e.target.checked })}
            checked={selectedLayerConfig.source.cluster.useCentroid}
            compressed
            disabled={selectedLayerConfig.source.cluster.fieldType === 'geo_shape'}
          />
        </EuiFormRow>

        <EuiFormRow
          label={i18n.translate('clusterSection.customLabel', {
            defaultMessage: 'Custom label',
          })}
          isInvalid={false}
          fullWidth={true}
        >
          <EuiFieldText
            value={selectedLayerConfig.source.cluster.custom_label}
            onChange={(e) => handleClusterAggChange({ custom_label: e.target.value })}
            compressed
            placeholder={i18n.translate('clusterSection.addCustomLabel', {
              defaultMessage: 'Add a custom label',
            })}
          />
        </EuiFormRow>
        <EuiSpacer size="s" />
        <EuiAccordion id="advanced" buttonContent="Advanced" initialIsOpen={!isJsonValid}>
          <EuiFormRow isInvalid={false} fullWidth={true}>
            <JsonEditor
              value={selectedLayerConfig.source.cluster.json}
              setValue={(value) => handleClusterAggChange({ json: value })}
              setValidity={setJsonValid}
            />
          </EuiFormRow>
        </EuiAccordion>
      </EuiForm>
    </EuiPanel>
  );
};
