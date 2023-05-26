/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiColorPalettePickerPaletteProps } from '@elastic/eui';

export const MetricAggregations = [
  {
    label: 'Count',
    value: 'count',
    acceptedFieldTypes: [''],
  },
  {
    label: 'Average',
    value: 'avg',
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
    value: 'geohash_grid',
    acceptedFieldTypes: ['geo_point', 'geo_shape'],
  },
  {
    label: 'Geotile',
    value: 'geotile_grid',
    acceptedFieldTypes: ['geo_point', 'geo_shape'],
  },
  {
    label: 'Geohex',
    value: 'geohex_grid',
    acceptedFieldTypes: ['geo_point'],
  },
] as const;

export const MetricDocLink = 'https://opensearch.org/docs/latest/aggregations/metric-agg/';
export const ClusterDocLink = 'https://opensearch.org/docs/latest/aggregations/bucket-agg/';
export const GeoHexDocLink = 'https://opensearch.org/docs/latest/aggregations/geohexgrid/';

export const Palettes: EuiColorPalettePickerPaletteProps[] = [
  {
    value: 'blue',
    palette: [
      {
        stop: 0,
        color: '#e3e9f4',
      },
      {
        stop: 25,
        color: '#abc7e0',
      },
      {
        stop: 50,
        color: '#74a6cc',
      },
      {
        stop: 75,
        color: '#3c84b8',
      },
      {
        stop: 100,
        color: '#0462a5',
      },
    ],
    type: 'gradient',
  },
  {
    value: 'green',
    palette: [
      {
        stop: 0,
        color: '#e3f4f3',
      },
      {
        stop: 25,
        color: '#abe5e1',
      },
      {
        stop: 50,
        color: '#73d4cf',
      },
      {
        stop: 75,
        color: '#3ac5bd',
      },
      {
        stop: 100,
        color: '#02b6ab',
      },
    ],
    type: 'gradient',
  },
  {
    value: 'yellow',
    palette: [
      {
        stop: 0,
        color: '#f4f4e3',
      },
      {
        stop: 25,
        color: '#f4e1aa',
      },
      {
        stop: 50,
        color: '#f4cc71',
      },
      {
        stop: 75,
        color: '#f4b738',
      },
      {
        stop: 100,
        color: '#f5a200',
      },
    ],
    type: 'gradient',
  },
  {
    value: 'orange',
    palette: [
      {
        stop: 0,
        color: '#f4eee3',
      },
      {
        stop: 25,
        color: '#f6c9ab',
      },
      {
        stop: 50,
        color: '#f8a572',
      },
      {
        stop: 75,
        color: '#fa823b',
      },
      {
        stop: 100,
        color: '#fd5c02',
      },
    ],
    type: 'gradient',
  },
  {
    value: 'red',
    palette: [
      {
        stop: 0,
        color: '#f4e3e3',
      },
      {
        stop: 25,
        color: '#f3aaaa',
      },
      {
        stop: 50,
        color: '#f27272',
      },
      {
        stop: 75,
        color: '#f13a3a',
      },
      {
        stop: 100,
        color: '#f00101',
      },
    ],
    type: 'gradient',
  },
  {
    value: 'purple',
    palette: [
      {
        stop: 0,
        color: '#eee3f4',
      },
      {
        stop: 25,
        color: '#c9abeb',
      },
      {
        stop: 50,
        color: '#a573e2',
      },
      {
        stop: 75,
        color: '#803ad7',
      },
      {
        stop: 100,
        color: '#5b02cd',
      },
    ],
    type: 'gradient',
  },
];
