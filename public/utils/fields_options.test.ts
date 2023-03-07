/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { getFieldsOptions } from './fields_options';
import { IndexPattern } from '../../../../src/plugins/data/common';

describe('getFieldsOptions', () => {
  const mockIndexPattern = {
    fields: [
      {
        name: 'field1',
        displayName: 'Field 1',
        type: 'text',
      },
      {
        name: 'field2',
        displayName: 'Field 2',
        type: 'number',
      },
      {
        name: 'field3',
        displayName: 'Field 3',
        type: 'geo_point',
      },
      {
        name: 'field4',
        displayName: 'Field 4',
        type: 'geo_shape',
      },
    ],
  } as IndexPattern;

  it('should return all fields options if no acceptedFieldTypes are specified', () => {
    const expectedFieldsOptions = [
      { label: 'text', options: [{ label: 'Field 1' }] },
      {
        label: 'number',
        options: [{ label: 'Field 2' }],
      },
      {
        label: 'geo_point',
        options: [{ label: 'Field 3' }],
      },
      {
        label: 'geo_shape',
        options: [{ label: 'Field 4' }],
      },
    ];
    const fieldsOptions = getFieldsOptions(mockIndexPattern);
    expect(fieldsOptions).toEqual(expectedFieldsOptions);
  });

  it('should return only options for acceptedFieldTypes', () => {
    const acceptedFieldTypes = ['geo_point', 'geo_shape'];
    const expectedFieldsOptions = [
      { label: 'geo_point', options: [{ label: 'Field 3' }] },
      {
        label: 'geo_shape',
        options: [{ label: 'Field 4' }],
      },
    ];
    const fieldsOptions = getFieldsOptions(mockIndexPattern, acceptedFieldTypes);
    expect(fieldsOptions).toEqual(expectedFieldsOptions);
  });

  it('should return an empty array if indexPattern is null', () => {
    const fieldsOptions = getFieldsOptions(null);
    expect(fieldsOptions).toEqual([]);
  });

  it('should return an empty array if indexPattern fields are null', () => {
    const mockIndexPatternWithoutFields = {
      fields: null,
    } as unknown as IndexPattern;
    const fieldsOptions = getFieldsOptions(mockIndexPatternWithoutFields);
    expect(fieldsOptions).toEqual([]);
  });
});
