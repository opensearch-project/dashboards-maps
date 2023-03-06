/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LngLat } from 'maplibre-gl';
import { GeoBounds } from '../map/boundary';
import { FilterMeta, FILTERS, GeoBoundingBoxFilter } from '../../../../../src/plugins/data/common';
import { buildBBoxFilter, buildSpatialGeometryFilter, GeoShapeFilter } from './filter';
import { Polygon } from 'geojson';

describe('test bounding box filter', function () {
  it('should return valid bounding box', function () {
    const mockBounds: GeoBounds = {
      bottomRight: new LngLat(-2.340000000000032, 27.67),
      topLeft: new LngLat(-135.18, 71.01),
    };
    const mockFilterMeta: FilterMeta = {
      alias: null,
      disabled: true,
      negate: false,
    };
    const actualGeoBoundingBoxFilter: GeoBoundingBoxFilter = buildBBoxFilter(
      'field-name',
      mockBounds,
      mockFilterMeta
    );
    const expectedBounds = {
      bottom_right: {
        lat: mockBounds.bottomRight.lat,
        lon: mockBounds.bottomRight.lng,
      },
      top_left: {
        lat: mockBounds.topLeft.lat,
        lon: mockBounds.topLeft.lng,
      },
    };
    expect(actualGeoBoundingBoxFilter.geo_bounding_box).toEqual({
      ['field-name']: expectedBounds,
    });
    expect(actualGeoBoundingBoxFilter.meta.params).toEqual(expectedBounds);
  });
});

describe('test geo shape filter', function () {
  it('should return valid geo shape query', function () {
    const mockPolygon: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [74.006, 40.7128],
          [71.0589, 42.3601],
          [73.7562, 42.6526],
          [74.006, 40.7128],
        ],
      ],
    };
    const mockLabel: string = 'mypolygon';
    const fieldName: string = 'location';

    const geoShapeFilter: GeoShapeFilter = buildSpatialGeometryFilter(
      fieldName,
      mockPolygon,
      mockLabel,
      'INTERSECTS'
    );
    const expectedFilter: GeoShapeFilter = {
      meta: {
        alias: mockLabel,
        disabled: false,
        negate: false,
        key: 'location',
        type: FILTERS.SPATIAL_FILTER,
      },
      geo_shape: {
        ignore_unmapped: true,
        location: {
          relation: 'INTERSECTS',
          shape: {
            type: 'Polygon',
            coordinates: [
              [
                [74.006, 40.7128],
                [71.0589, 42.3601],
                [73.7562, 42.6526],
                [74.006, 40.7128],
              ],
            ],
          },
        },
      },
    };
    expect(geoShapeFilter).toEqual(expectedFilter);
  });
});
