/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LatLon } from '@opensearch-project/opensearch/api/types';
import { FilterMeta, GeoBoundingBoxFilter } from '../../../../../src/plugins/data/common';
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
