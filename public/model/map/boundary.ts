/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LngLat, LngLatBounds, Map as Maplibre } from 'maplibre-gl';
import { MAX_LONGITUDE, MIN_LONGITUDE } from '../../../common';

export interface GeoBounds {
  bottomRight: LngLat;
  topLeft: LngLat;
}

// calculate lng limits based on map bounds
// maps can render more than 1 copies of map at lower zoom level and displays
// one side from 1 copy and other side from other copy at higher zoom level if
// screen crosses internation dateline
export function getBounds(map: Maplibre): GeoBounds {
  const mapBounds: LngLatBounds = map.getBounds();
  const boundsMinLng: number = mapBounds.getNorthWest().lng;
  const boundsMaxLng: number = mapBounds.getSouthEast().lng;

  let right: number;
  let left: number;
  // if bounds expands more than 360 then, consider complete globe is visible
  if (boundsMaxLng - boundsMinLng >= MAX_LONGITUDE - MIN_LONGITUDE) {
    right = MAX_LONGITUDE;
    left = MIN_LONGITUDE;
  } else {
    // wrap bounds if only portion of globe is visible
    // wrap() returns a new LngLat object whose longitude is
    // wrapped to the range (-180, 180).
    right = mapBounds.getSouthEast().wrap().lng;
    left = mapBounds.getNorthWest().wrap().lng;
  }
  return {
    bottomRight: new LngLat(right, mapBounds.getSouthEast().lat),
    topLeft: new LngLat(left, mapBounds.getNorthWest().lat),
  };
}
