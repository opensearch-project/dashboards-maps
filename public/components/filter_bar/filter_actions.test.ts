/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {disableGeoShapeFilterMeta, enableGeoShapeFilterMeta, toggleGeoShapeFilterMetaNegated} from './filter_actions';
import { GeoShapeFilterMeta } from '../../../../../src/plugins/data/common';

describe('test filter actions', function () {
  it('should enable GeoShapeFilterMeta', function () {
    const updatedFilterMeta: GeoShapeFilterMeta = enableGeoShapeFilterMeta({
      alias: null,
      negate: false,
      params: {},
      disabled: true,
    });
    expect(updatedFilterMeta.disabled).toEqual(false);
  });
  it('should disable GeoShapeFilterMeta', function () {
    const updatedFilterMeta: GeoShapeFilterMeta = disableGeoShapeFilterMeta({
      alias: null,
      negate: false,
      params: {},
      disabled: false,
    });
    expect(updatedFilterMeta.disabled).toEqual(true);
  });
  it('should toggle GeoShapeFilterMeta negation', function () {
    const updatedFilterMeta: GeoShapeFilterMeta = toggleGeoShapeFilterMetaNegated({
      alias: null,
      negate: false,
      params: {},
      disabled: false,
    });
    expect(updatedFilterMeta.negate).toEqual(true);
  });
});
