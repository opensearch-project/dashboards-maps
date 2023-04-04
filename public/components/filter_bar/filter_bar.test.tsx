/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { shallow } from 'enzyme';
import React from 'react';
import { FilterBar } from './filter_bar';
import { FILTERS, GeoShapeFilterMeta, ShapeFilter } from '../../../../../src/plugins/data/common';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';
import { Polygon } from 'geojson';

it('renders one filter inside filter bar', () => {
  const mockCallback = jest.fn();
  const mockPolygon: Polygon = {
    type: 'Polygon',
    coordinates: [
      [
        [74.006, 40.7128],
        [71.0589, 42.3601],
        [73.7562, 42.6526],
        [74.006, 40.7128],
      ],
    ],
  };
  const expectedParams: {
    shape: ShapeFilter;
    relation: GeoShapeRelation;
  } = {
    shape: mockPolygon,
    relation: 'intersects',
  };
  const mockFilterMeta: GeoShapeFilterMeta = {
    alias: 'mylabel',
    disabled: false,
    negate: false,
    type: FILTERS.GEO_SHAPE,
    params: expectedParams,
  };
  const filterBar = shallow(
    <FilterBar
      filters={[mockFilterMeta]}
      onFiltersUpdated={mockCallback}
      className={'some-class-name'}
    />
  );
  expect(filterBar).toMatchSnapshot();
});
