/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { geohashColumns } from './decode';
import {
  MAP_DEFAULT_MAX_ZOOM,
  MAP_DEFAULT_MIN_ZOOM,
  CLUSTER_DEFAULT_PRECISION,
} from '../../common';
/**
 * Get the number of geohash columns (world-wide) for a given precision
 * @param precision the geohash precision
 * @returns {number} the number of columns
 */

function getMaxPrecision() {
  return 10;
}

export function getZoomPrecision() {
  /**
   * Map Leaflet zoom levels to geohash precision levels.
   * The size of a geohash column-width on the map should be at least `minGeohashPixels` pixels wide.
   */

  const zoomPrecision: any = {};
  const minGeohashPixels = 16;
  const maxPrecision = 12;

  for (let zoom = MAP_DEFAULT_MIN_ZOOM; zoom < MAP_DEFAULT_MAX_ZOOM; zoom += 1) {
    const worldPixels = 256 * Math.pow(2, zoom);
    zoomPrecision[zoom] = 1;
    for (let precision = 2; precision <= maxPrecision; precision += 1) {
      const columns = geohashColumns(precision);
      if (worldPixels / columns >= minGeohashPixels) {
        zoomPrecision[zoom] = precision;
      } else {
        break;
      }
    }
  }
  return zoomPrecision;
}

export function getPrecision(val: string) {
  let precision = parseInt(val, 10);
  const maxPrecision = getMaxPrecision();

  if (Number.isNaN(precision)) {
    precision = CLUSTER_DEFAULT_PRECISION;
  }

  if (precision > maxPrecision) {
    return maxPrecision;
  }

  return precision;
}
