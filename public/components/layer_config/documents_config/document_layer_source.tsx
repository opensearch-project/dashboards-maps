/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  EuiComboBox,
  EuiFlexItem,
  EuiFormLabel,
  EuiFlexGrid,
  EuiFieldNumber,
  EuiFormErrorText,
  EuiCollapsibleNavGroup,
  EuiSpacer,
  EuiPanel,
  EuiForm,
  EuiCheckbox,
  EuiFormRow,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import _, { Dictionary } from 'lodash';
import { Filter, IndexPattern, IndexPatternField } from '../../../../../../src/plugins/data/public';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../../types';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';

interface Props {
  setSelectedLayerConfig: Function;
  selectedLayerConfig: DocumentLayerSpecification;
  setIsUpdateDisabled: Function;
}

export const DocumentLayerSource = ({
  setSelectedLayerConfig,
  selectedLayerConfig,
  setIsUpdateDisabled,
}: Props) => {
  const {
    services: {
      savedObjects: { client: savedObjectsClient },
      data: {
        ui: { IndexPatternSelect, SearchBar },
        indexPatterns,
      },
    },
  } = useOpenSearchDashboards<MapServices>();
  const [indexPattern, setIndexPattern] = useState<IndexPattern | null>();
  const [geoFields, setGeoFields] = useState<IndexPatternField[]>();
  const [selectedField, setSelectedField] = useState<IndexPatternField | null | undefined>();
  const [hasInvalidRequestNumber, setHasInvalidRequestNumber] = useState<boolean>(false);
  const [showTooltips, setShowTooltips] = useState<boolean>(
    selectedLayerConfig.source.showTooltips
  );

  const errorsMap = {
    datasource: ['Required'],
    geoFields: ['Required'],
  };

  useEffect(() => {
    const disableUpdate = !indexPattern || !selectedField || hasInvalidRequestNumber;
    setIsUpdateDisabled(disableUpdate);
  }, [setIsUpdateDisabled, indexPattern, selectedField, hasInvalidRequestNumber]);

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

  const tooltipFieldsOptions = () => {
    const fieldList = indexPattern?.fields;
    if (!fieldList) return [];
    const fieldTypeMap: Dictionary<IndexPatternField[]> = _.groupBy(
      fieldList,
      (field) => field.type
    );

    const fieldOptions: Array<{ label: string; options: Array<{ label: string }> }> = [];
    let fieldsOfSameType: Array<{ label: string }> = [];

    Object.entries(fieldTypeMap).forEach(([fieldType, fieldEntries]) => {
      for (const field of fieldEntries) {
        fieldsOfSameType.push({ label: `${field.displayName || field.name}` });
      }
      fieldOptions.push({
        label: `${fieldType}`,
        options: fieldsOfSameType,
      });
      fieldsOfSameType = [];
    });
    return fieldOptions;
  };

  const formatTooltipFieldsToComboBox = (fields: string[]) => {
    if (!fields) return [];

    return fields?.map((field) => {
      return {
        label: field,
      };
    });
  };

  const onDocumentRequestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selectedNumber = parseInt(value, 10);
    const source = { ...selectedLayerConfig.source, documentRequestNumber: selectedNumber };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onTooltipSelectionChange = (options: any[]) => {
    const tooltipSelection: string[] = [];
    for (const option of options) {
      tooltipSelection.push(option.label);
    }
    const source = { ...selectedLayerConfig.source, tooltipFields: tooltipSelection };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onFiltersUpdated = useCallback(
    (filters: Filter[]) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source: { ...selectedLayerConfig.source, filters },
      });
    },
    [selectedLayerConfig]
  );

  useEffect(() => {
    const selectIndexPattern = async () => {
      if (selectedLayerConfig.source.indexPatternId) {
        const selectedIndexPattern = await indexPatterns.get(
          selectedLayerConfig.source.indexPatternId
        );
        setIndexPattern(selectedIndexPattern);
      }
    };
    selectIndexPattern();
  }, [indexPatterns, selectedLayerConfig.source.indexPatternId]);

  // Update the fields list every time the index pattern is modified.
  useEffect(() => {
    const acceptedFieldTypes = ['geo_point', 'geo_shape'];
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
        geoFieldType: selectedField?.type,
      };
      setSelectedLayerConfig({ ...selectedLayerConfig, source });
    };
    setLayerSource();
  }, [selectedField]);

  useEffect(() => {
    setHasInvalidRequestNumber(
      selectedLayerConfig.source.documentRequestNumber < 1 ||
        selectedLayerConfig.source.documentRequestNumber > 10000
    );
  }, [selectedLayerConfig.source.documentRequestNumber]);

  const onShowTooltipsChange = (event: { target: { checked: React.SetStateAction<boolean> } }) => {
    setShowTooltips(event.target.checked);
    const source = { ...selectedLayerConfig.source, showTooltips: event.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onToggleGeoBoundingBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = { ...selectedLayerConfig.source, useGeoBoundingBoxFilter: e.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const shouldTooltipSectionOpen = () => {
    return (
      selectedLayerConfig.source.showTooltips &&
      selectedLayerConfig.source.tooltipFields?.length > 0
    );
  };

  const filterPanelInitialIsOpen =
    selectedLayerConfig.source.filters?.length > 0 ||
    selectedLayerConfig.source.useGeoBoundingBoxFilter;

  return (
    <div>
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Documents"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={true}
        >
          <EuiForm>
            <EuiFlexGrid columns={1}>
              <EuiFlexItem>
                <EuiFormRow
                  label="Data source"
                  isInvalid={!indexPattern}
                  error={errorsMap.datasource}
                  data-test-subj={'indexPatternSelect'}
                  fullWidth={true}
                >
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
                    data-test-subj={'indexPatternSelect'}
                    fullWidth={true}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow
                  label="Geospatial field"
                  isInvalid={!selectedField}
                  error={errorsMap.geoFields}
                  data-test-subj={'geoFieldSelect'}
                  fullWidth={true}
                >
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
                    data-test-subj={'geoFieldSelect'}
                    fullWidth={true}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormLabel>Number of documents</EuiFormLabel>
                <EuiSpacer size="xs" />
                <EuiFieldNumber
                  placeholder="Number of documents"
                  value={selectedLayerConfig.source.documentRequestNumber}
                  onChange={onDocumentRequestNumberChange}
                  aria-label="Use aria labels when no actual label is in use"
                  isInvalid={hasInvalidRequestNumber}
                  fullWidth={true}
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
          </EuiForm>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Filters"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={filterPanelInitialIsOpen}
        >
          <SearchBar
            appName="maps-dashboards"
            showQueryBar={false}
            indexPatterns={indexPattern ? [indexPattern] : []}
            filters={selectedLayerConfig.source.filters ?? []}
            onFiltersUpdated={onFiltersUpdated}
          />
          <EuiSpacer />
          <EuiFormRow>
            <EuiCheckbox
              id={`${selectedLayerConfig.id}-bounding-box-filter`}
              disabled={selectedLayerConfig.source.geoFieldType !== 'geo_point'}
              label={'Only request data around map extent'}
              checked={selectedLayerConfig.source.useGeoBoundingBoxFilter ? true : false}
              onChange={onToggleGeoBoundingBox}
              compressed
            />
          </EuiFormRow>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Tooltips"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={shouldTooltipSectionOpen()}
        >
          <EuiFlexGrid columns={1}>
            <EuiFlexItem>
              <EuiCheckbox
                id="toggle-tooltip"
                label="Show tooltips"
                checked={showTooltips}
                onChange={onShowTooltipsChange}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormLabel>Tooltip fields</EuiFormLabel>
              <EuiSpacer size="xs" />
              <EuiComboBox
                options={tooltipFieldsOptions()}
                selectedOptions={formatTooltipFieldsToComboBox(
                  selectedLayerConfig.source.tooltipFields
                )}
                singleSelection={false}
                onChange={onTooltipSelectionChange}
                sortMatchesBy="startsWith"
                placeholder={i18n.translate('documentLayer.selectDataFieldPlaceholder', {
                  defaultMessage: 'Add tooltip fields',
                })}
                fullWidth={true}
              />
            </EuiFlexItem>
          </EuiFlexGrid>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
    </div>
  );
};
