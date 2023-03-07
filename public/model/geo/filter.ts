/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LatLon } from '@opensearch-project/opensearch/api/types';
import { Polygon } from 'geojson';
import {
  Filter,
  FilterMeta,
  FILTERS,
  GeoBoundingBoxFilter,
} from '../../../../../src/plugins/data/common';
import { GeoBounds } from '../map/boundary';

export type FilterRelations = 'INTERSECTS' | 'DISJOINT' | 'WITHIN';

export type GeoShapeFilter = Filter & {
  meta: FilterMeta;
  geo_shape: any;
};

export const buildBBoxFilter = (
  fieldName: string,
  mapBounds: GeoBounds,
  filterMeta: FilterMeta
): GeoBoundingBoxFilter => {
  const bottomRight: LatLon = {
    lon: mapBounds.bottomRight.lng,
    lat: mapBounds.bottomRight.lat,
  };

  const topLeft: LatLon = {
    lon: mapBounds.topLeft.lng,
    lat: mapBounds.topLeft.lat,
  };

  const boundingBox = {
    bottom_right: bottomRight,
    top_left: topLeft,
  };
  return {
    meta: {
      ...filterMeta,
      params: boundingBox,
    },
    geo_bounding_box: {
      [fieldName]: boundingBox,
    },
  };
};

export const buildSpatialGeometryFilter = (
  fieldName: string,
  filterShape: Polygon,
  filterLabel: string,
  relation: FilterRelations
): GeoShapeFilter => {
  const meta: FilterMeta = {
    negate: false,
    key: fieldName,
    alias: filterLabel,
    type: FILTERS.SPATIAL_FILTER,
    disabled: false,
  };

  return {
    meta,
    geo_shape: {
      ignore_unmapped: true,
      [fieldName]: {
        relation,
        shape: filterShape,
      },
    },
  };
};
