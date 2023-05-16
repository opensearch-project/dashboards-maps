/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const MetricAggregations = [
  {
    label: 'Count',
    value: 'count',
    acceptedFieldTypes: [''],
  },
  {
    label: 'Average',
    value: 'average',
    acceptedFieldTypes: ['number', 'histogram'],
  },
  {
    label: 'Sum',
    value: 'sum',
    acceptedFieldTypes: ['number', 'histogram'],
  },
  {
    label: 'Max',
    value: 'max',
    acceptedFieldTypes: ['number', 'date'],
  },
  {
    label: 'Min',
    value: 'min',
    acceptedFieldTypes: ['number', 'date'],
  },
] as const;

export const ClusterAggregations = [
  {
    label: 'Geohash',
    value: 'geohash',
  },
  {
    label: 'Geotile',
    value: 'geotile',
  },
  {
    label: 'Geohex',
    value: 'geohex',
  },
] as const;
export const MetricDocLink = 'https://opensearch.org/docs/latest/aggregations/metric-agg/';
export const ClusterDocLink = 'https://opensearch.org/docs/latest/aggregations/bucket-agg/';
export const GeoHexDocLink = 'https://opensearch.org/docs/latest/aggregations/geohexgrid/';
