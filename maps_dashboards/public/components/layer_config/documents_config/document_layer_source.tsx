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
  EuiCollapsibleNavGroup,
  EuiSpacer,
  EuiPanel,
  EuiForm,
  EuiSwitch,
  EuiFormRow,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import { IndexPattern, IndexPatternField } from '../../../../../../src/plugins/data/public';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../../types';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';
import _, { Dictionary } from "lodash";

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
  const [showTooltips, setShowTooltips] = useState<boolean>(
    selectedLayerConfig.source.showTooltips
  );
  const [selectedTooltipFields, setSelectedTooltipFields] = useState<string[]>(
    selectedLayerConfig.source.tooltipFields
  );

  const errorsMap = {
    datasource: ['Required'],
    geoFields: ['Required'],
  };

  useEffect(() => {
    const disableUpdate = !indexPattern || !selectedField;
    setIsUpdateDisabled(disableUpdate);
  }, [setIsUpdateDisabled, indexPattern, selectedField]);

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
    const selectedNumber = parseInt(value, 10) || 1;
    setDocumentRequestNumber(selectedNumber);
    const source = { ...selectedLayerConfig.source, documentRequestNumber: selectedNumber };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onTooltipSelectionChange = (options: any[]) => {
    const tooltipSelection: string[] = [];
    for (const option of options) {
      tooltipSelection.push(option.label);
    }
    setSelectedTooltipFields(tooltipSelection);
    const source = { ...selectedLayerConfig.source, tooltipFields: tooltipSelection };
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
    if (selectedLayerConfig.source.indexPatternId === indexPattern?.id) {
      setSelectedTooltipFields(selectedLayerConfig.source.tooltipFields);
    } else {
      setSelectedTooltipFields([]);
    }
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
    setHasInvalidRequestNumber(documentRequestNumber < 1 || documentRequestNumber > 1000);
  }, [documentRequestNumber]);

  const onShowTooltipsChange = (event: { target: { checked: React.SetStateAction<boolean> } }) => {
    setShowTooltips(event.target.checked);
    const source = { ...selectedLayerConfig.source, showTooltips: event.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const shouldTooltipSectionOpen = () => {
    return (
      selectedLayerConfig.source.showTooltips === true &&
      selectedLayerConfig.source.tooltipFields?.length > 0
    );
  };

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
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow
                  label="Geospatial Field"
                  isInvalid={!selectedField}
                  error={errorsMap.geoFields}
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
                  />
                </EuiFormRow>
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
          </EuiForm>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Tool Tips"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={shouldTooltipSectionOpen()}
        >
          <EuiFlexGrid columns={1}>
            <EuiFlexItem>
              <EuiFormRow display="columnCompressedSwitch" label={'Show Tooltips'}>
                <EuiSwitch
                  label={showTooltips ? 'on' : 'off'}
                  checked={showTooltips}
                  onChange={onShowTooltipsChange}
                  compressed
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormLabel>Tooltip Fields</EuiFormLabel>
              <EuiSpacer size="xs" />
              <EuiComboBox
                options={tooltipFieldsOptions()}
                selectedOptions={formatTooltipFieldsToComboBox(selectedTooltipFields)}
                singleSelection={false}
                onChange={onTooltipSelectionChange}
                sortMatchesBy="startsWith"
                placeholder={i18n.translate('documentLayer.selectDataFieldPlaceholder', {
                  defaultMessage: 'Add tooltip fields',
                })}
              />
            </EuiFlexItem>
          </EuiFlexGrid>
        </EuiCollapsibleNavGroup>
      </EuiPanel>
    </div>
  );
};
