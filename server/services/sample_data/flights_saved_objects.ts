/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { ConfigSchema } from '../../../common/config';

const layerList = (config: ConfigSchema) => [
  {
    name: 'Default map',
    description: '',
    type: 'opensearch_vector_tile_map',
    id: '15bc3560-700e-479d-b49b-be5ece0451ce',
    zoomRange: [0, 22],
    opacity: 100,
    visibility: 'visible',
    source: {
      dataURL: config.opensearchVectorTileDataUrl,
    },
    style: {
      styleURL: config.opensearchVectorTileStyleUrl,
    },
  },
  {
    name: 'Flights On Time',
    description: 'Shows flights that are on time',
    type: 'documents',
    id: '033e870c-4195-48ce-8cc1-e428f0545ce4',
    zoomRange: [0, 6],
    opacity: 70,
    visibility: 'visible',
    source: {
      indexPatternRefName: 'opensearch_dashboards_sample_data_flights',
      geoFieldType: 'geo_point',
      geoFieldName: 'DestLocation',
      documentRequestNumber: 1000,
      tooltipFields: ['OriginAirportID', 'DestAirportID', 'FlightNum', 'Carrier', 'FlightTimeMin'],
      showTooltips: true,
      indexPatternId: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
      useGeoBoundingBoxFilter: true,
      filters: [
        {
          meta: {
            index: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
            alias: null,
            negate: false,
            disabled: false,
          },
          query: {
            match_phrase: {
              FlightDelay: false,
            },
          },
          $state: {
            store: 'appState',
          },
        },
        {
          meta: {
            index: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
            alias: null,
            negate: false,
            disabled: false,
          },
          query: {
            match_phrase: {
              Cancelled: false,
            },
          },
          $state: {
            store: 'appState',
          },
        },
      ],
    },
    style: {
      fillColor: '#36f20b',
      borderColor: '#36f20b',
      borderThickness: 1,
      markerSize: 5,
    },
  },
  {
    name: 'Delayed Flights',
    description: 'Shows flights that are having delay',
    type: 'documents',
    id: '7ccae1a8-770d-4565-8c91-6125764fd344',
    zoomRange: [3, 6],
    opacity: 70,
    visibility: 'visible',
    source: {
      indexPatternRefName: 'opensearch_dashboards_sample_data_flights',
      geoFieldType: 'geo_point',
      geoFieldName: 'DestLocation',
      documentRequestNumber: 1000,
      tooltipFields: [
        'OriginAirportID',
        'DestAirportID',
        'Carrier',
        'FlightDelayMin',
        'FlightDelayType',
      ],
      showTooltips: true,
      indexPatternId: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
      useGeoBoundingBoxFilter: true,
      filters: [
        {
          meta: {
            index: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
            alias: null,
            negate: false,
            disabled: false,
          },
          query: {
            match_phrase: {
              FlightDelay: true,
            },
          },
          $state: {
            store: 'appState',
          },
        },
      ],
    },
    style: {
      fillColor: '#DA8B45',
      borderColor: '#DA8B45',
      borderThickness: 1,
      markerSize: 5,
    },
  },
  {
    name: 'Cancelled Flights',
    description: 'Shows flights that are cancelled',
    type: 'documents',
    id: '70a61cb4-bea5-4a7b-8f2b-e6debd4334dd',
    zoomRange: [4, 22],
    opacity: 70,
    visibility: 'visible',
    source: {
      indexPatternRefName: 'opensearch_dashboards_sample_data_flights',
      geoFieldType: 'geo_point',
      geoFieldName: 'DestLocation',
      documentRequestNumber: 1000,
      tooltipFields: ['OriginAirportID', 'DestAirportID', 'FlightNum', 'Carrier'],
      showTooltips: true,
      indexPatternId: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
      useGeoBoundingBoxFilter: true,
      filters: [
        {
          meta: {
            index: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
            alias: null,
            negate: false,
            disabled: false,
          },
          query: {
            match_phrase: {
              Cancelled: true,
            },
          },
          $state: {
            store: 'appState',
          },
        },
      ],
    },
    style: {
      fillColor: '#f40a0a',
      borderColor: '#f40a0a',
      borderThickness: 1,
      markerSize: 5,
    },
  },
];

export const getFlightsSavedObjects = (config: ConfigSchema) => {
  return [
    {
      id: '88a24e6c-0216-4f76-8bc7-c8db6c8705da',
      type: 'map',
      updated_at: '2023-02-20T03:57:15.482Z',
      version: 'WzIzLDFd',
      migrationVersion: {},
      attributes: {
        title: i18n.translate('home.sampleData.flightsSpec.flightsStatusDestinationLocationMaps', {
          defaultMessage: '[Flights] Flights Status on Maps Destination Location',
        }),
        description:
          'Sample map that shows flights at destination location that are on time, delayed and cancelled within a given time range.',
        layerList: JSON.stringify(layerList(config)),
        mapState:
          '{"timeRange":{"from":"now-1w","to":"now"},"query":{"query":"","language":"kuery"},"refreshInterval":{"pause":true,"value":12000}}',
      },
      references: [],
    },
  ];
};
