import React, { useEffect, useState } from 'react';
import { EuiComboBox, EuiFlexItem, EuiFormLabel, EuiFlexGrid } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { IndexPattern, IndexPatternField } from '../../../../../src/plugins/data/public';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { ILayerConfig } from '../../model/ILayerConfig';

interface Props {
  setSelectedLayerConfig: Function;
  selectedLayerConfig: ILayerConfig;
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

  function formatFieldToComboBox(field?: IndexPatternField | null) {
    if (!field) return [];
    return formatFieldsToComboBox([field]);
  }
  function formatFieldsToComboBox(fields?: IndexPatternField[]) {
    if (!fields) return [];

    return fields?.map((field) => {
      return {
        label: field.displayName || field.name,
      };
    });
  }

  useEffect(() => {
    const setDefaultIndexPattern = async () => {
      const defaultIndexPattern = await indexPatterns.getDefault();
      setIndexPattern(defaultIndexPattern);
    };

    setDefaultIndexPattern();
  }, [indexPatterns]);

  // Update the fields list every time the index pattern is modified.
  useEffect(() => {
    const fields = indexPattern?.fields.filter((field) => field.type === 'geo_point');
    setGeoFields(fields);
    setSelectedField(fields?.length ? fields[0] : null);
  }, [indexPattern]);

  useEffect(() => {
    const doAsyncSearch = async () => {
      if (!indexPattern || !selectedField) return;
      console.log(indexPattern, 'Print-----indexPattern-----doAsyncSearch');
      const source = {
        indexPatternRefName: indexPattern?.title,
        geoField: selectedField?.displayName,
      };
      setSelectedLayerConfig({ ...selectedLayerConfig, source });
    };
    doAsyncSearch();
  }, [selectedField]);

  return (
    <EuiFlexGrid columns={1}>
      <EuiFlexItem>
        <EuiFormLabel>Index Pattern</EuiFormLabel>
        <IndexPatternSelect
          savedObjectsClient={savedObjectsClient}
          placeholder={i18n.translate('backgroundSessionExample.selectIndexPatternPlaceholder', {
            defaultMessage: 'Select index pattern',
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
        <EuiFormLabel>Geo Field</EuiFormLabel>
        <EuiComboBox
          options={formatFieldsToComboBox(geoFields)}
          selectedOptions={formatFieldToComboBox(selectedField)}
          singleSelection={true}
          onChange={(option) => {
            const field = indexPattern?.getFieldByName(option[0].label);
            setSelectedField(field || null);
          }}
          sortMatchesBy="startsWith"
        />
      </EuiFlexItem>
    </EuiFlexGrid>
  );
};
