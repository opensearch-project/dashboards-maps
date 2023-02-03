/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// import { SavedObject } from 'opensearch-dashboards/server';

import { i18n } from '@osd/i18n';
// import { ConfigSchema } from '../../../common/config';

// const layerList = (mapConfig: ConfigSchema) => [

// const urls = (mapConfig: ConfigSchema) => ({
//   dataUrl: mapConfig.opensearchVectorTileDataUrl,
//   styleUrl: mapConfig.opensearchVectorTileStyleUrl,
// });
const layerList = [
  {
    name: 'Default map',
    description: '',
    type: 'opensearch_vector_tile_map',
    id: 'cad56fcc-be02-43ea-a1a6-1d17f437acf7',
    zoomRange: [0, 22],
    opacity: 100,
    visibility: 'visible',
    source: {
      dataURL: 'https://tiles.maps.opensearch.org/data/v1.json',
    },
    style: {
      styleURL: 'https://tiles.maps.opensearch.org/styles/basic.json',
    },
  },
  {
    name: 'Cancelled flights',
    description: 'Shows cancelled flights',
    type: 'documents',
    id: 'f3ae28ce-2494-4e50-ae31-4603cfcbfd7d',
    zoomRange: [2, 22],
    opacity: 70,
    visibility: 'visible',
    source: {
      indexPatternRefName: 'opensearch_dashboards_sample_data_flights',
      geoFieldType: 'geo_point',
      geoFieldName: 'DestLocation',
      documentRequestNumber: 1000,
      tooltipFields: ['Carrier', 'Cancelled'],
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
      fillColor: '#CA8EAE',
      borderColor: '#CA8EAE',
      borderThickness: 1,
      markerSize: 5,
    },
  },
];

export const getFlightsSavedObjects = () => {
  return [
    {
      id: '122713b0-9e70-11ed-9463-35a6f30dbef6',
      type: 'map',
      updated_at: '2023-01-27T18:26:09.643Z',
      version: 'WzIzLDFd',
      migrationVersion: {},
      attributes: {
        title: i18n.translate('home.sampleData.flightsSpec.mapsCancelledFlights', {
          defaultMessage: '[Flights] Maps Cancelled Flights Destination Location',
        }),
        description: 'Sample map to show cancelled flights location at destination',
        layerList: JSON.stringify(layerList),
        mapState:
          '{"timeRange":{"from":"now-15d","to":"now"},"query":{"query":"","language":"kuery"},"refreshInterval":{"pause":true,"value":12000}}',
      },
      references: [],
    },
  ];
};
