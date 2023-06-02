/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { geohashColumns } from './decode';
import { MAP_DEFAULT_MAX_ZOOM, MAP_DEFAULT_MIN_ZOOM } from '../../common';
import { ClusterLayerSpecification } from '../model/mapLayerType';
import { ClusterAggregations } from '../components/layer_config/cluster_config/config';

export const getZoomPrecision = (
  zoom: number,
  aggType: ClusterLayerSpecification['source']['cluster']['agg']
) => {
  if (aggType === 'geohash_grid') {
    return getGeoHashZoomPrecision(zoom);
  } else {
    const percentage =
      (zoom - MAP_DEFAULT_MIN_ZOOM) / (MAP_DEFAULT_MAX_ZOOM - MAP_DEFAULT_MIN_ZOOM);
    //Different agg type has different precisionRange.
    const precisionRange = ClusterAggregations.find(
      (item) => item.value === aggType
    )!.precisionRange;

    const precisionLength = precisionRange[1] - precisionRange[0];
    const newPrecision = precisionLength * percentage + precisionRange[0];
    return Math.round(newPrecision);
  }
};

export function getGeoHashZoomPrecision(zoom: number) {
  /**
   * Map Leaflet zoom levels to geohash precision levels.
   * The size of a geohash column-width on the map should be at least `minGeohashPixels` pixels wide.
   */

  const zoomPrecision: Record<string, number> = {};
  const minGeohashPixels = 16;
  const maxGeoHashPrecision = 12;

  for (let zoom = MAP_DEFAULT_MIN_ZOOM; zoom < MAP_DEFAULT_MAX_ZOOM; zoom += 1) {
    const worldPixels = 256 * Math.pow(2, zoom);
    zoomPrecision[zoom] = 1;
    for (let precision = 2; precision <= maxGeoHashPrecision; precision += 1) {
      const columns = geohashColumns(precision);
      if (worldPixels / columns >= minGeohashPixels) {
        zoomPrecision[zoom] = precision;
      } else {
        break;
      }
    }
  }
  return zoomPrecision[zoom];
}
