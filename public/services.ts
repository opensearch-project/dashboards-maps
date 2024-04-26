/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreStart } from '../../../src/core/public';
import { createGetterSetter } from '../../../src/plugins/opensearch_dashboards_utils/common';
import { TimefilterContract } from '../../../src/plugins/data/public';

export const postGeojson = async (
  requestBody: any,
  http: CoreStart['http'],
  dataSourceRefId: string
) => {
  try {
    const query = dataSourceRefId ? { dataSourceId: dataSourceRefId } : undefined;

    return await http.post('../api/custom_import_map/_upload', {
      body: requestBody,
      ...(query && { query }),
    });
  } catch (e) {
    return e;
  }
};

export const getIndex = async (
  indexName: string,
  http: CoreStart['http'],
  dataSourceRefId: string
) => {
  try {
    const query = dataSourceRefId ? { dataSourceId: dataSourceRefId } : undefined;
    return await http.post('../api/custom_import_map/_indices', {
      body: JSON.stringify({ index: indexName }),
      ...(query && { query }),
    });
  } catch (e) {
    return e;
  }
};

export const [getTimeFilter, setTimeFilter] = createGetterSetter<TimefilterContract>('TimeFilter');
