/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LngLat } from 'maplibre-gl';
import { GeoBounds } from '../map/boundary';
import { FilterMeta, GeoBoundingBoxFilter } from '../../../../../src/plugins/data/common';
import { buildBBoxFilter } from './filter';

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
