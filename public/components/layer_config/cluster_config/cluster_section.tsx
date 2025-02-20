import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  EuiForm,
  EuiFlexGrid,
  EuiFlexItem,
  EuiComboBoxOptionOption,
  EuiCompressedFormRow,
  EuiCompressedComboBox,
  EuiCompressedCheckbox,
  EuiText,
  EuiLink,
  EuiRange,
  EuiFieldText,
  EuiAccordion,
} from '@elastic/eui';
import { formatFieldStringToComboBox, getFieldsOptions } from '../../../utils/fields_options';
import { IndexPattern } from '../../../../../../src/plugins/data/public';
import { i18n } from '@osd/i18n';
import { JsonEditor } from './json_editor';
import { ClusterAggregations, ClusterDocLink, GeoHexDocLink } from './config';
import { ClusterLayerSpecification } from 'public/model/mapLayerType';
import { CanUpdateMapType } from './cluster_layer_source';
import _ from 'lodash';
import { CLUSTER_DEFAULT_PRECISION } from '../../../../common';

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
  const selectedAggConfig = useMemo(() => {
    const aggValue = selectedLayerConfig.source.cluster.agg;
    const aggConfig = ClusterAggregations.find((agg) => agg.value === aggValue);
    return aggConfig!;
  }, [selectedLayerConfig.source.cluster.agg]);

  const acceptedFieldTypes = useMemo(() => {
    return selectedAggConfig.acceptedFieldTypes as unknown as string[];
  }, [selectedAggConfig]);

  const geoFields = useMemo(() => {
    return indexPattern?.fields.filter((field) => acceptedFieldTypes.indexOf(field.type) !== -1);
  }, [indexPattern]);

  const selectedField = useMemo(() => {
    return geoFields?.find((field) => field.name === selectedLayerConfig.source.cluster.field);
  }, [geoFields, selectedLayerConfig]);

  const isFieldValid = useMemo(() => {
    return !!selectedLayerConfig.source.cluster.field;
  }, [selectedLayerConfig.source.cluster.field]);

  const onAggTypeChange = useCallback(
    (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
      const newAgg = selectedOptions[0].value;
      const newAggPrecisionRange = ClusterAggregations.find(
        (agg) => agg.value === newAgg
      )?.precisionRange;
      let newObj: Record<string, string | number> = { agg: newAgg! };
      const currentPrecision = selectedLayerConfig.source.cluster.precision;
      //If agg changed, will check if precision value is valid in new aggregation
      if (
        currentPrecision < newAggPrecisionRange![0] ||
        currentPrecision > newAggPrecisionRange![1]
      ) {
        newObj = { ...newObj, precision: CLUSTER_DEFAULT_PRECISION };
      }
      handleClusterAggChange(newObj);
    },
    [selectedLayerConfig.source.cluster.precision]
  );

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
    (object: Record<string, string | boolean | number>) => {
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
    <EuiForm>
      <EuiFlexGrid columns={1}>
        <EuiFlexItem>
          <EuiCompressedFormRow
            label={i18n.translate('clusterSection.geoAggType', {
              defaultMessage: 'Geoaggregation type',
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
                (agg) => agg.value === selectedLayerConfig.source.cluster.agg
              )}
              onChange={onAggTypeChange}
              isClearable={false}
              compressed
            />
          </EuiCompressedFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCompressedFormRow
            label={i18n.translate('clusterSection.geoField', {
              defaultMessage: 'Geospatial field',
            })}
            isInvalid={!isFieldValid}
            data-test-subj={'clusterFieldSelect'}
            fullWidth={true}
            error={'Required'}
          >
            <EuiCompressedComboBox
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
          </EuiCompressedFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCompressedCheckbox
            id="changePrecision"
            label={i18n.translate('clusterSection.changePrecision', {
              defaultMessage: 'Change precision on map zoom',
            })}
            onChange={(e) => handleClusterAggChange({ changePrecision: e.target.checked })}
            checked={selectedLayerConfig.source.cluster.changePrecision}
          />
        </EuiFlexItem>
        {!selectedLayerConfig.source.cluster.changePrecision && (
          <EuiFlexItem>
            <EuiCompressedFormRow
              label={i18n.translate('clusterSection.precision', {
                defaultMessage: 'Precision',
              })}
            >
              <EuiRange
                min={selectedAggConfig.precisionRange[0]}
                max={selectedAggConfig.precisionRange[1]}
                value={selectedLayerConfig.source.cluster.precision}
                onChange={(e) => handleClusterAggChange({ precision: e.currentTarget.value })}
                showValue
                compressed
              />
            </EuiCompressedFormRow>
          </EuiFlexItem>
        )}
        <EuiFlexItem>
          <EuiCompressedCheckbox
            id="geocentroid"
            label={i18n.translate('clusterSection.useGeocentroid', {
              defaultMessage: 'Place markers off grid (use geocentroid)',
            })}
            onChange={(e) => handleClusterAggChange({ useCentroid: e.target.checked })}
            checked={selectedLayerConfig.source.cluster.useCentroid}
            disabled={selectedLayerConfig.source.cluster.fieldType === 'geo_shape'}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCompressedFormRow
            label={i18n.translate('clusterSection.customLabel', {
              defaultMessage: 'Custom label',
            })}
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
          </EuiCompressedFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiAccordion id="advanced" buttonContent="Advanced" initialIsOpen={!isJsonValid}>
            <EuiCompressedFormRow fullWidth={true}>
              <JsonEditor
                value={selectedLayerConfig.source.cluster.json}
                setValue={(value) => handleClusterAggChange({ json: value })}
                setValidity={setJsonValid}
              />
            </EuiCompressedFormRow>
          </EuiAccordion>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiForm>
  );
};
