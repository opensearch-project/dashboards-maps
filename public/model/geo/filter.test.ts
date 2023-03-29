/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LngLat } from 'maplibre-gl';
import { GeoBounds } from '../map/boundary';
import {
  FilterMeta,
  FILTERS,
  GeoBoundingBoxFilter,
  GeoShapeFilterMeta,
  GeoShapeFilter,
  ShapeFilter,
  FilterStateStore,
} from '../../../../../src/plugins/data/common';
import { buildBBoxFilter, buildGeoShapeFilter, buildGeoShapeFilterMeta } from './filter';
import { Polygon } from 'geojson';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';

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
    const expectedParams: {
      shape: ShapeFilter;
      relation: GeoShapeRelation;
    } = {
      shape: mockPolygon,
      relation: 'intersects',
    };
    const mockFilterMeta: GeoShapeFilterMeta = {
      alias: mockLabel,
      disabled: false,
      negate: false,
      type: FILTERS.GEO_SHAPE,
      params: expectedParams,
    };
    const geoShapeFilter: GeoShapeFilter = buildGeoShapeFilter(fieldName, mockFilterMeta);

    const expectedFilterMeta: GeoShapeFilterMeta = {
      ...mockFilterMeta,
      key: fieldName,
    };
    const expectedFilter = {
      geo_shape: {
        ignore_unmapped: true,
        location: {
          relation: 'intersects',
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
    expect(geoShapeFilter.geo_shape).toEqual(expectedFilter.geo_shape);
    expect(geoShapeFilter.meta).toEqual(expectedFilterMeta);
    expect(geoShapeFilter.$state?.store).toEqual(FilterStateStore.APP_STATE);
  });
});

describe('build GeoShapeFilterMeta', function () {
  it('should return valid filter meta', function () {

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
    const actualFilter: GeoShapeFilterMeta = buildGeoShapeFilterMeta(
      'label',
      mockPolygon,
      'intersects'
    );
    const expectedParams: {
      shape: ShapeFilter;
      relation: GeoShapeRelation;
    } = {
      shape: mockPolygon,
      relation: 'intersects',
    };
    const expectedFilter: GeoShapeFilterMeta = {
      disabled: false,
      negate: false,
      alias: 'label',
      type: FILTERS.GEO_SHAPE,
      params: expectedParams,
    };
    expect(actualFilter).toEqual(expectedFilter);
  });
});
