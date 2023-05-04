/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AggGroupNames } from '../../../../../../src/plugins/data/common';
import { IAggConfig } from '../../../../../../src/plugins/data/public';

const metricsSchema = {
  group: AggGroupNames.Metrics,
  name: 'metric',
  title: 'Value',
  min: 1,
  max: 1,
  aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality', 'top_hits'],
  defaults: [
    {
      schema: 'metric',
      type: 'count',
      id: '1',
    },
  ],
  editor: false,
  params: [],
};
const bucketsSchema = {
  group: AggGroupNames.Buckets,
  name: 'segment',
  title: 'Geo coordinates',
  aggFilter: ['geohash_grid', 'geotile_grid'],
  min: 1,
  max: 1,
  editor: false,
  params: [],
  defaults: null,
};
export const schemas = {
  metrics: [metricsSchema],
  buckets: [bucketsSchema],
  all: [metricsSchema, bucketsSchema],
};
const defaultMetricsSchema = {
  group: AggGroupNames.Metrics,
  name: 'metric',
  title: 'Value',
  min: 1,
  max: 1,
  aggFilter: [''],
  defaults: [],
  editor: false,
  params: [],
};
const defaultBucketsSchema = {
  group: AggGroupNames.Buckets,
  name: 'segment',
  title: 'Geo coordinates',
  aggFilter: [''],
  min: 1,
  max: 1,
  editor: false,
  params: [],
  defaults: null,
};

//when no indexpattern, we can't create aggs. So we use a default mock schema, this will contain null filters.
export const defaultSchemas = {
  metrics: [defaultMetricsSchema],
  buckets: [defaultBucketsSchema],
};

//when no indexpattern, we can't create aggs. So we use a default aggConfig.
export const defaultAggs = [
  {
    aggConfigs: {
      aggs: [
        {
          id: '1',
          enabled: true,
          type: 'count',
          params: {},
          schema: 'metric',
        },
        {
          id: '2',
          enabled: true,
          type: 'geotile_grid',
          params: {},
          schema: 'segment',
        },
      ],
    },
    brandNew: undefined,
    enabled: true,
    id: '1',
    params: {},
    parent: undefined,
    schema: 'metric',
    subAggs: [],
  },
  {
    aggConfigs: {
      typesRegistry: {},
      aggs: [
        {
          id: '1',
          enabled: true,
          type: 'count',
          params: {},
          schema: 'metric',
        },
        {
          id: '2',
          enabled: true,
          type: 'geotile_grid',
          params: {},
          schema: 'segment',
        },
      ],
    },
    brandNew: undefined,
    enabled: true,
    id: '2',
    params: {},
    parent: undefined,
    schema: 'segment',
    subAggs: [],
  },
] as unknown as IAggConfig[];
