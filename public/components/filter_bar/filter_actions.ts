/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeoShapeFilterMeta } from '../../../../../src/plugins/data/common';

export const enableGeoShapeFilterMeta = (meta: GeoShapeFilterMeta) =>
  !meta.disabled ? meta : toggleGeoShapeFilterMetaDisabled(meta);

export const disableGeoShapeFilterMeta = (meta: GeoShapeFilterMeta) =>
  meta.disabled ? meta : toggleGeoShapeFilterMetaDisabled(meta);

export const toggleGeoShapeFilterMetaNegated = (meta: GeoShapeFilterMeta) => {
  const negate = !meta.negate;
  return { ...meta, negate };
};
export const toggleGeoShapeFilterMetaDisabled = (meta: GeoShapeFilterMeta) => {
  const status: boolean = !meta.disabled;
  return { ...meta, disabled: status };
};
