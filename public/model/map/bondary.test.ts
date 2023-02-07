/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LngLat, LngLatBounds, Map as Maplibre } from 'maplibre-gl';
import { MockMaplibreMap } from './__mocks__/map';
import { GeoBounds, getBounds } from './boundary';

describe('verify get bounds', function () {
  it('should cover complete map if more than on copy is visible', function () {
    const ne: LngLat = new LngLat(333.811, 82.8);
    const sw: LngLat = new LngLat(-248.8, -79.75);
    const mockMap = new MockMaplibreMap([], new LngLatBounds(sw, ne));
    const expectedBounds: GeoBounds = {
      bottomRight: new LngLat(180, -79.75),
      topLeft: new LngLat(-180, 82.8),
    };
    expect(getBounds((mockMap as unknown) as Maplibre)).toEqual(expectedBounds);
  });

  it('should wrap if map crosses international date line', function () {
    const ne: LngLat = new LngLat(11.56, 80.85);
    const sw: LngLat = new LngLat(-220.77, 21.52);
    const mockMap = new MockMaplibreMap([], new LngLatBounds(sw, ne));
    const expectedBounds: GeoBounds = {
      bottomRight: new LngLat(11.559999999999945, 21.52),
      topLeft: new LngLat(139.23000000000002, 80.85),
    };
    expect(getBounds((mockMap as unknown) as Maplibre)).toEqual(expectedBounds);
  });
  it('should give same value as map bounds for other cases', function () {
    const sw: LngLat = new LngLat(-135.18, 27.67);
    const ne: LngLat = new LngLat(-2.34, 71.01);
    const mockMap = new MockMaplibreMap([], new LngLatBounds(sw, ne));
    const expectedBounds: GeoBounds = {
      bottomRight: new LngLat(-2.340000000000032, 27.67),
      topLeft: new LngLat(-135.18, 71.01),
    };
    expect(getBounds((mockMap as unknown) as Maplibre)).toEqual(expectedBounds);
  });
});
