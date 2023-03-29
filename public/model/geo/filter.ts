/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeoShapeRelation, LatLon } from '@opensearch-project/opensearch/api/types';
import {
  FilterMeta,
  FILTERS,
  FilterState,
  FilterStateStore,
  GeoBoundingBoxFilter,
  GeoShapeFilter,
  GeoShapeFilterMeta,
  ShapeFilter,
} from '../../../../../src/plugins/data/common';
import { GeoBounds } from '../map/boundary';

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

export const buildGeoShapeFilterMeta = (
  filterLabel: string | null,
  filterShape: ShapeFilter,
  relation: GeoShapeRelation
): GeoShapeFilterMeta => {
  return {
    type: FILTERS.GEO_SHAPE,
    alias: filterLabel,
    disabled: false,
    params: {
      relation,
      shape: filterShape,
    },
    negate: false,
  };
};

export const buildGeoShapeFilter = (
  fieldName: string,
  filterMeta: GeoShapeFilterMeta
): GeoShapeFilter => {
  const $state: FilterState = {
    store: FilterStateStore.APP_STATE,
  };
  return {
    meta: {
      ...filterMeta,
      key: fieldName,
    },
    geo_shape: {
      ignore_unmapped: true,
      [fieldName]: filterMeta.params,
    },
    $state,
  };
};
