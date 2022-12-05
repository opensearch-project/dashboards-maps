/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  EuiComboBox,
  EuiFlexItem,
  EuiFormLabel,
  EuiFlexGrid,
  EuiFieldNumber,
  EuiFormErrorText,
  EuiSpacer,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import { IndexPattern, IndexPatternField } from '../../../../../src/plugins/data/public';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { DocumentLayerSpecification } from '../../model/mapLayerType';

interface Props {
  setSelectedLayerConfig: Function;
  selectedLayerConfig: DocumentLayerSpecification;
}

export const DocumentLayerSource = ({ setSelectedLayerConfig, selectedLayerConfig }: Props) => {
  const {
    services: {
      savedObjects: { client: savedObjectsClient },
      data: {
        ui: { IndexPatternSelect },
        indexPatterns,
      },
    },
  } = useOpenSearchDashboards<MapServices>();
  const [indexPattern, setIndexPattern] = useState<IndexPattern | null>();
  const [geoFields, setGeoFields] = useState<IndexPatternField[]>();
  const [selectedField, setSelectedField] = useState<IndexPatternField | null | undefined>();
  const [documentRequestNumber, setDocumentRequestNumber] = useState<number>(
    selectedLayerConfig.source.documentRequestNumber
  );
  const [hasInvalidRequestNumber, setHasInvalidRequestNumber] = useState<boolean>(false);

  const formatFieldToComboBox = (field?: IndexPatternField | null) => {
    if (!field) return [];
    return formatFieldsToComboBox([field]);
  };

  const formatFieldsToComboBox = (fields?: IndexPatternField[]) => {
    if (!fields) return [];

    return fields?.map((field) => {
      return {
        label: field.displayName || field.name,
      };
    });
  };

  const onDocumentRequestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selectedNumber = parseInt(value, 10);
    setDocumentRequestNumber(selectedNumber);
    const source = { ...selectedLayerConfig.source, documentRequestNumber: selectedNumber };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  useEffect(() => {
    const selectIndexPattern = async () => {
      if (selectedLayerConfig.source.indexPatternId) {
        const savedIndexPattern = await indexPatterns.get(
          selectedLayerConfig.source.indexPatternId
        );
        setIndexPattern(savedIndexPattern);
      }
    };
    selectIndexPattern();
  }, [indexPatterns]);

  // Update the fields list every time the index pattern is modified.
  useEffect(() => {
    const acceptedFieldTypes = ['geo_point'];
    const fields = indexPattern?.fields.filter(
      (field) => acceptedFieldTypes.indexOf(field.type) !== -1
    );
    setGeoFields(fields);
    fields?.filter((field) => field.displayName === selectedLayerConfig.source.geoFieldName);
    const savedField = fields?.find(
      (field) => field.name === selectedLayerConfig.source.geoFieldName
    );
    setSelectedField(savedField);
  }, [indexPattern]);

  useEffect(() => {
    const setLayerSource = () => {
      if (!indexPattern || !selectedField) return;
      const source = {
        ...selectedLayerConfig.source,
        indexPatternRefName: indexPattern?.title,
        indexPatternId: indexPattern?.id,
        geoFieldName: selectedField?.displayName,
        geoFiledType: selectedField?.type,
      };
      setSelectedLayerConfig({ ...selectedLayerConfig, source });
    };
    setLayerSource();
  }, [selectedField]);

  useEffect(() => {
    setHasInvalidRequestNumber(documentRequestNumber < 1 || documentRequestNumber > 1000);
  }, [documentRequestNumber]);

  return (
    <EuiFlexGrid columns={1}>
      <EuiFlexItem>
        <EuiFormLabel>Data source</EuiFormLabel>
        <EuiSpacer size="xs" />
        <IndexPatternSelect
          savedObjectsClient={savedObjectsClient}
          placeholder={i18n.translate('documentLayer.selectDataSourcePlaceholder', {
            defaultMessage: 'Select data source',
          })}
          indexPatternId={indexPattern?.id || ''}
          onChange={async (newIndexPatternId: any) => {
            const newIndexPattern = await indexPatterns.get(newIndexPatternId);
            setIndexPattern(newIndexPattern);
          }}
          isClearable={false}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormLabel>Geospatial Field</EuiFormLabel>
        <EuiSpacer size="xs" />
        <EuiComboBox
          options={formatFieldsToComboBox(geoFields)}
          selectedOptions={formatFieldToComboBox(selectedField)}
          singleSelection={true}
          onChange={(option) => {
            const field = indexPattern?.getFieldByName(option[0].label);
            setSelectedField(field || null);
          }}
          sortMatchesBy="startsWith"
          placeholder={i18n.translate('documentLayer.selectDataFieldPlaceholder', {
            defaultMessage: 'Select data field',
          })}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormLabel>Number of documents</EuiFormLabel>
        <EuiSpacer size="xs" />
        <EuiFieldNumber
          placeholder="Number of documents"
          value={documentRequestNumber}
          onChange={onDocumentRequestNumberChange}
          aria-label="Use aria labels when no actual label is in use"
          isInvalid={hasInvalidRequestNumber}
        />
        {hasInvalidRequestNumber && (
          <EuiFormErrorText>
            <FormattedMessage
              id="maps.documents.dataSource.errorMessage"
              defaultMessage="Must between 1 and 10000"
            />
          </EuiFormErrorText>
        )}
      </EuiFlexItem>
    </EuiFlexGrid>
  );
};
