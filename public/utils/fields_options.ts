/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import _, { Dictionary } from 'lodash';
import { IndexPatternField } from '../../../../src/plugins/data/common';
import { IndexPattern } from '../../../../src/plugins/data/public';
export const getFieldsOptions = (
  indexPattern: IndexPattern | null | undefined,
  acceptedFieldTypes: string[] = []
) => {
  const fieldList = indexPattern?.fields;
  if (!fieldList) return [];
  const fieldTypeMap: Dictionary<IndexPatternField[]> = _.groupBy(fieldList, (field) => field.type);

  const fieldOptions: Array<{ label: string; options: Array<{ label: string }> }> = [];

  Object.entries(fieldTypeMap).forEach(([fieldType, fieldEntries]) => {
    const fieldsOfSameType: Array<{ label: string }> = [];
    for (const field of fieldEntries) {
      if (acceptedFieldTypes.length === 0 || acceptedFieldTypes.includes(field.type)) {
        fieldsOfSameType.push({ label: `${field.displayName || field.name}` });
      }
    }
    if (fieldsOfSameType.length > 0) {
      fieldOptions.push({
        label: `${fieldType}`,
        options: fieldsOfSameType,
      });
    }
  });
  return fieldOptions;
};

export const formatFieldsStringToComboBox = (
  fields: string[] | null | undefined
): Array<{ label: string }> => {
  if (!fields) return [];

  return fields.map((field) => {
    return {
      label: field,
    };
  });
};

export const formatFieldStringToComboBox = (
  field: string | undefined
): Array<{ label: string }> => {
  if (!field) return [];

  return formatFieldsStringToComboBox([field]);
};
