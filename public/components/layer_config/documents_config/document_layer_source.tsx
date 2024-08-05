/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import {
  EuiCompressedComboBox,
  EuiFlexItem,
  EuiFormLabel,
  EuiFlexGrid,
  EuiCompressedFieldNumber,
  EuiFormErrorText,
  EuiCollapsibleNavGroup,
  EuiSpacer,
  EuiPanel,
  EuiForm,
  EuiCompressedSwitch,
  EuiCompressedCheckbox,
  EuiCheckbox,
  EuiCompressedFormRow,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import { Filter, IndexPattern, IndexPatternField } from '../../../../../../src/plugins/data/public';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../../types';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';
import {
  formatFieldStringToComboBox,
  formatFieldsStringToComboBox,
  getFieldsOptions,
} from '../../../utils/fields_options';

interface Props {
  setSelectedLayerConfig: Function;
  selectedLayerConfig: DocumentLayerSpecification;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
  setIndexPattern: Function;
}

interface MemorizedForm {
  [indexPatternId: string]:
    | {
        filters?: Filter[];
        geoField?: IndexPatternField;
      }
    | undefined;
}

export const DocumentLayerSource = ({
  setSelectedLayerConfig,
  selectedLayerConfig,
  setIsUpdateDisabled,
  indexPattern,
  setIndexPattern,
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
  const [hasInvalidRequestNumber, setHasInvalidRequestNumber] = useState<boolean>(false);
  const [enableTooltips, setEnableTooltips] = useState<boolean>(
    selectedLayerConfig.source.showTooltips
  );
  const memorizedForm = useRef<MemorizedForm>({});
  const acceptedFieldTypes = ['geo_point', 'geo_shape'];
  const cacheKey = `${selectedLayerConfig.id}/${indexPattern?.id}`;

  const geoFields = useMemo(() => {
    return indexPattern?.fields.filter((field) => acceptedFieldTypes.indexOf(field.type) !== -1);
  }, [indexPattern]);

  const selectedField = useMemo(() => {
    return geoFields?.find((field) => field.name === selectedLayerConfig.source.geoFieldName);
  }, [geoFields, selectedLayerConfig]);

  const hasInvalidTooltipFields = useMemo(() => {
    return (
      selectedLayerConfig.source.tooltipFields?.length === 0 &&
      selectedLayerConfig.source.showTooltips
    );
  }, [selectedLayerConfig.source.showTooltips, selectedLayerConfig.source.tooltipFields?.length]);

  // We want to memorize the filters and geoField selection when a map layer config is opened
  useEffect(() => {
    if (indexPattern?.id && indexPattern.id === selectedLayerConfig.source.indexPatternId) {
      if (!memorizedForm.current[cacheKey]) {
        memorizedForm.current[cacheKey] = {
          filters: selectedLayerConfig.source.filters,
          geoField: selectedField,
        };
      }
    }
  }, [indexPattern, selectedLayerConfig, selectedField]);

  const onGeoFieldChange = useCallback(
    (field: IndexPatternField | null) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source: {
          ...selectedLayerConfig.source,
          geoFieldName: field?.displayName || undefined,
          geoFieldType: field?.type || undefined,
        },
      });
      // We'd like to memorize the geo field selection so that the selection
      // can be restored when changing index pattern back and forth
      if (indexPattern?.id) {
        memorizedForm.current[cacheKey] = {
          ...memorizedForm.current[cacheKey],
          geoField: field || undefined,
        };
      }
    },
    [selectedLayerConfig, setSelectedLayerConfig, indexPattern]
  );

  const errorsMap = {
    datasource: ['Required'],
    geoFields: ['Required'],
  };

  useEffect(() => {
    const disableUpdate =
      !indexPattern || !selectedField || hasInvalidRequestNumber || hasInvalidTooltipFields;
    setIsUpdateDisabled(disableUpdate);
  }, [
    setIsUpdateDisabled,
    indexPattern,
    selectedField,
    hasInvalidRequestNumber,
    hasInvalidTooltipFields,
  ]);

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
      // We'd like to memorize the filter selection so that the selection
      // can be restored when changing index pattern back and forth
      if (indexPattern?.id) {
        memorizedForm.current[cacheKey] = {
          ...memorizedForm.current[cacheKey],
          filters,
        };
      }
    },
    [selectedLayerConfig, indexPattern]
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

  // Handle the side effects of index pattern change
  useEffect(() => {
    const source = { ...selectedLayerConfig.source };
    // when index pattern changed, reset filters and geo field
    if (indexPattern && indexPattern.id !== selectedLayerConfig.source.indexPatternId) {
      source.indexPatternId = indexPattern.id ?? '';
      source.indexPatternRefName = indexPattern.title;
      // Use memorized filters, otherwise, set filter selection to empty
      const filters = indexPattern.id ? memorizedForm.current[cacheKey]?.filters ?? [] : [];
      source.filters = filters;

      // Use memorized geo field, otherwise, set geo filter to empty
      const geoField = indexPattern.id ? memorizedForm.current[cacheKey]?.geoField : undefined;
      if (geoField) {
        source.geoFieldName = geoField.displayName;
        source.geoFieldType = geoField.type as 'geo_point' | 'geo_shape';
      }
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source,
      });
    }
  }, [indexPattern]);

  useEffect(() => {
    setHasInvalidRequestNumber(
      selectedLayerConfig.source.documentRequestNumber < 1 ||
        selectedLayerConfig.source.documentRequestNumber > 10000
    );
  }, [selectedLayerConfig.source.documentRequestNumber]);

  const onEnableTooltipsChange = (event: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setEnableTooltips(event.target.checked);
    const source = { ...selectedLayerConfig.source, showTooltips: event.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onDisplayTooltipsOnHoverChange = (event: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    const source = { ...selectedLayerConfig.source, displayTooltipsOnHover: event.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onToggleGeoBoundingBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = { ...selectedLayerConfig.source, useGeoBoundingBoxFilter: e.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onApplyGlobalFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = { ...selectedLayerConfig.source, applyGlobalFilters: e.target.checked };
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
                <EuiCompressedFormRow
                  label="Index pattern"
                  isInvalid={!indexPattern}
                  error={errorsMap.datasource}
                  data-test-subj={'indexPatternSelect'}
                  fullWidth={true}
                >
                  <IndexPatternSelect
                    savedObjectsClient={savedObjectsClient}
                    placeholder={i18n.translate('documentLayer.selectDataSourcePlaceholder', {
                      defaultMessage: 'Select index pattern',
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
                </EuiCompressedFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiCompressedFormRow
                  label="Geospatial field"
                  isInvalid={!selectedField}
                  error={errorsMap.geoFields}
                  data-test-subj={'geoFieldSelect'}
                  fullWidth={true}
                >
                  <EuiCompressedComboBox
                    options={getFieldsOptions(indexPattern, acceptedFieldTypes)}
                    selectedOptions={formatFieldStringToComboBox(selectedField?.displayName)}
                    singleSelection={true}
                    onChange={(option) => {
                      const field = indexPattern?.getFieldByName(option[0]?.label);
                      onGeoFieldChange(field || null);
                    }}
                    sortMatchesBy="startsWith"
                    placeholder={i18n.translate('documentLayer.selectDataFieldPlaceholder', {
                      defaultMessage: 'Select data field',
                    })}
                    data-test-subj={'geoFieldSelect'}
                    fullWidth={true}
                    isClearable={false}
                  />
                </EuiCompressedFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormLabel>Number of documents</EuiFormLabel>
                <EuiSpacer size="xs" />
                <EuiCompressedFieldNumber
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
          <EuiCompressedFormRow>
            <EuiCheckbox
              id={`${selectedLayerConfig.id}-bounding-box-filter`}
              label={'Only request data around map extent'}
              checked={selectedLayerConfig.source.useGeoBoundingBoxFilter ? true : false}
              onChange={onToggleGeoBoundingBox}
              compressed
            />
          </EuiCompressedFormRow>
          <EuiCompressedFormRow>
            <EuiCheckbox
              id={`${selectedLayerConfig.id}-apply-global-filter`}
              label={i18n.translate('documentLayer.applyGlobalFilters', {
                defaultMessage: 'Apply global filters',
              })}
              checked={selectedLayerConfig.source?.applyGlobalFilters ?? true}
              onChange={onApplyGlobalFilters}
              compressed
            />
          </EuiCompressedFormRow>
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
              <EuiCompressedCheckbox
                id="enable-tooltip"
                label={i18n.translate('documentLayer.enableTooltips', {
                  defaultMessage: 'Enable tooltips',
                })}
                checked={enableTooltips}
                onChange={onEnableTooltipsChange}
              />
            </EuiFlexItem>
            {enableTooltips && (
              <>
                <EuiFlexItem>
                  <EuiFormLabel>Tooltip fields</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiCompressedComboBox
                    options={getFieldsOptions(indexPattern)}
                    selectedOptions={formatFieldsStringToComboBox(
                      selectedLayerConfig.source.tooltipFields
                    )}
                    singleSelection={false}
                    onChange={onTooltipSelectionChange}
                    sortMatchesBy="startsWith"
                    placeholder={i18n.translate('documentLayer.addedTooltipFields', {
                      defaultMessage: 'Add tooltip fields',
                    })}
                    fullWidth={true}
                    isInvalid={hasInvalidTooltipFields}
                  />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiCompressedSwitch
                    label={i18n.translate('documentLayer.displayTooltipsOnHover', {
                      defaultMessage: 'Display tooltips on hover',
                    })}
                    checked={selectedLayerConfig.source?.displayTooltipsOnHover ?? true}
                    onChange={onDisplayTooltipsOnHoverChange}
                    disabled={!enableTooltips}
                  />
                </EuiFlexItem>
              </>
            )}
          </EuiFlexGrid>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
    </div>
  );
};
