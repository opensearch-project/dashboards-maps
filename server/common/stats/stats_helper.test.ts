/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedObjectsFindResponse } from '../../../../../src/core/server';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { getStats } from './stats_helper';

describe('getStats', () => {
  const mockSavedObjects: SavedObjectsFindResponse<MapSavedObjectAttributes> = {
    page: 1,
    per_page: 1000,
    total: 3,
    saved_objects: [
      {
        type: 'map',
        id: 'cfa702d0-cf47-11ed-9728-3b2a82d0d675',
        attributes: {
          title: 'test1',
          description: '',
          layerList:
            '[{"name":"Default map","description":"","type":"opensearch_vector_tile_map","id":"2b7a9a72-e29e-45f4-9e47-93c12c6e07cb","zoomRange":[0,22],"opacity":100,"visibility":"visible","source":{"dataURL":"https://tiles.maps.opensearch.org/data/v1.json"},"style":{"styleURL":"https://tiles.maps.opensearch.org/styles/basic.json"}},{"name":"New layer 2","description":"","type":"documents","id":"6ed74651-533c-4a4b-b453-c70ed63bbc8a","zoomRange":[0,22],"opacity":70,"visibility":"visible","source":{"indexPatternRefName":"opensearch_dashboards_sample_data_logs","geoFieldType":"geo_point","geoFieldName":"geo.coordinates","documentRequestNumber":1000,"tooltipFields":[],"showTooltips":false,"displayTooltipsOnHover":true,"applyGlobalFilters":true,"indexPatternId":"90943e30-9a47-11e8-b64d-95841ca0b247","filters":[{"meta":{"index":"90943e30-9a47-11e8-b64d-95841ca0b247","params":{},"alias":null,"negate":false,"disabled":false},"range":{"bytes":{"gte":11,"lt":233}},"$state":{"store":"appState"}}]},"style":{"fillColor":"#f32a8a","borderColor":"#f32a8a","borderThickness":1,"markerSize":5,"label":{"enabled":false,"textByFixed":"","textByField":"","textType":"by_field","size":15,"borderWidth":0,"color":"#000000","borderColor":"#FFFFFF"}}}]',
          mapState:
            '{"timeRange":{"from":"now-15m","to":"now"},"query":{"query":"","language":"kuery"},"refreshInterval":{"pause":true,"value":12000}}',
          version: 1,
        },
        references: [],
        updated_at: '2023-03-30T22:12:55.966Z',
        version: 'WzIxNSwxXQ==',
        score: 0,
      },
      {
        type: 'map',
        id: 'b1483670-cf4b-11ed-9fa4-bbade202e9e0',
        attributes: {
          title: 'test2',
          description: '',
          layerList:
            '[{"name":"Default map","description":"","type":"opensearch_vector_tile_map","id":"ea10f34e-f927-420b-8467-ee7950143dd8","zoomRange":[0,22],"opacity":100,"visibility":"visible","source":{"dataURL":"https://tiles.maps.opensearch.org/data/v1.json"},"style":{"styleURL":"https://tiles.maps.opensearch.org/styles/basic.json"}},{"name":"New layer 2","description":"","type":"documents","id":"0b231a61-e44a-4c2c-b821-82be5441925f","zoomRange":[0,22],"opacity":70,"visibility":"visible","source":{"indexPatternRefName":"opensearch_dashboards_sample_data_logs","geoFieldType":"geo_point","geoFieldName":"geo.coordinates","documentRequestNumber":1000,"tooltipFields":[],"showTooltips":false,"displayTooltipsOnHover":true,"applyGlobalFilters":true,"indexPatternId":"90943e30-9a47-11e8-b64d-95841ca0b247","filters":[]},"style":{"fillColor":"#622d7f","borderColor":"#622d7f","borderThickness":1,"markerSize":5,"label":{"enabled":false,"textByFixed":"","textByField":"","textType":"by_field","size":15,"borderWidth":0,"color":"#000000","borderColor":"#FFFFFF"}}},{"name":"New layer 3","description":"","type":"documents","id":"ab1a5116-ad57-40a4-832d-be10edca4976","zoomRange":[0,22],"opacity":70,"visibility":"visible","source":{"indexPatternRefName":"opensearch_dashboards_sample_data_flights","geoFieldType":"geo_point","geoFieldName":"DestLocation","documentRequestNumber":1000,"tooltipFields":[],"showTooltips":false,"displayTooltipsOnHover":true,"applyGlobalFilters":true,"indexPatternId":"d3d7af60-4c81-11e8-b3d7-01146121b73d","filters":[]},"style":{"fillColor":"#6d11fa","borderColor":"#6d11fa","borderThickness":1,"markerSize":5,"label":{"enabled":false,"textByFixed":"","textByField":"","textType":"by_field","size":15,"borderWidth":0,"color":"#000000","borderColor":"#FFFFFF"}}}]',
          mapState:
            '{"timeRange":{"from":"now-7d","to":"now"},"query":{"query":"","language":"kuery"},"refreshInterval":{"pause":true,"value":12000},"spatialMetaFilters":[{"type":"geo_shape","alias":"rectangle","disabled":false,"params":{"relation":"intersects","shape":{"coordinates":[[[-106.03593830559568,46.582217440485095],[-80.61568219066639,46.582217440485095],[-80.61568219066639,28.78448193045257],[-106.03593830559568,28.78448193045257],[-106.03593830559568,46.582217440485095]]],"type":"Polygon"}},"negate":false}]}',
          version: 1,
        },
        references: [],
        updated_at: '2023-03-30T22:56:11.273Z',
        version: 'WzIxOSwxXQ==',
        score: 0,
      },
      {
        type: 'map',
        id: '48b5ddb0-cfd7-11ed-96c2-f323ef4d8d0b',
        attributes: {
          title: 'test3',
          description: '',
          layerList:
            '[{"name":"Default map","description":"","type":"opensearch_vector_tile_map","id":"bce4c650-434c-4785-8429-b9f9f2042054","zoomRange":[0,22],"opacity":100,"visibility":"visible","source":{"dataURL":"https://tiles.maps.opensearch.org/data/v1.json"},"style":{"styleURL":"https://tiles.maps.opensearch.org/styles/basic.json"}},{"name":"New layer 2","description":"","type":"documents","id":"48104a9b-72aa-4aa0-8dbf-e19ad4462dd0","zoomRange":[0,22],"opacity":70,"visibility":"visible","source":{"indexPatternRefName":"opensearch_dashboards_sample_data_logs","geoFieldType":"geo_point","geoFieldName":"geo.coordinates","documentRequestNumber":1000,"tooltipFields":[],"showTooltips":false,"displayTooltipsOnHover":true,"applyGlobalFilters":true,"indexPatternId":"90943e30-9a47-11e8-b64d-95841ca0b247","filters":[]},"style":{"fillColor":"#da23f2","borderColor":"#da23f2","borderThickness":1,"markerSize":5,"label":{"enabled":false,"textByFixed":"","textByField":"","textType":"by_field","size":15,"borderWidth":0,"color":"#000000","borderColor":"#FFFFFF"}}}]',
          mapState:
            '{"timeRange":{"from":"now-24h","to":"now"},"query":{"query":"response:404","language":"kuery"},"refreshInterval":{"pause":true,"value":12000}}',
          version: 1,
        },
        references: [],
        updated_at: '2023-03-31T15:18:26.313Z',
        version: 'WzIyMCwxXQ==',
        score: 0,
      },
    ],
  };

  const mockEmptySavedObjects: SavedObjectsFindResponse<MapSavedObjectAttributes> = {
    page: 1,
    per_page: 1000,
    total: 0,
    saved_objects: [],
  };

  it('returns expected stats', () => {
    const stats = getStats(mockSavedObjects);
    expect(stats.maps_total).toEqual(3);
    expect(stats.layers_filters_total).toEqual(1);
    expect(stats.layers_total.opensearch_vector_tile_map).toEqual(3);
    expect(stats.layers_total.documents).toEqual(4);
    expect(stats.layers_total.wms).toEqual(0);
    expect(stats.layers_total.tms).toEqual(0);
    expect(stats.maps_list.length).toEqual(3);
    expect(stats.maps_list[0].id).toEqual('cfa702d0-cf47-11ed-9728-3b2a82d0d675');
    expect(stats.maps_list[0].layers_filters_total).toEqual(1);
    expect(stats.maps_list[0].layers_total.documents).toEqual(1);
    expect(stats.maps_list[0].layers_total.opensearch_vector_tile_map).toEqual(1);
  });

  it('returns expected stats with empty saved objects', () => {
    const stats = getStats(mockEmptySavedObjects);
    expect(stats.maps_total).toEqual(0);
    expect(stats.layers_filters_total).toEqual(0);
    expect(stats.layers_total.opensearch_vector_tile_map).toEqual(0);
    expect(stats.layers_total.documents).toEqual(0);
    expect(stats.layers_total.wms).toEqual(0);
    expect(stats.layers_total.tms).toEqual(0);
    expect(stats.maps_list.length).toEqual(0);
  });
});
