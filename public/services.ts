/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreStart } from '../../../src/core/public';
import { createGetterSetter } from '../../../src/plugins/opensearch_dashboards_utils/common';
import { TimefilterContract, DataPublicPluginStart } from '../../../src/plugins/data/public';

export const postGeojson = async (requestBody: any, http: CoreStart['http']) => {
  try {
    const response = await http.post('../api/custom_import_map/_upload', {
      body: requestBody,
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const getIndex = async (indexName: string, http: CoreStart['http']) => {
  try {
    const response = await http.post('../api/custom_import_map/_indices', {
      body: JSON.stringify({
        index: indexName,
      }),
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const [getTimeFilter, setTimeFilter] = createGetterSetter<TimefilterContract>('TimeFilter');

export const [getFormatService, setFormatService] =
  createGetterSetter<DataPublicPluginStart['fieldFormats']>('data.fieldFormats');
