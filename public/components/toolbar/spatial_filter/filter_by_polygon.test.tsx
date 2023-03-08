/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { shallow } from 'enzyme';
import React from 'react';
import { FilterByPolygon } from './filter_by_polygon';

it('renders filter by polygon button', () => {
  const mockCallback = jest.fn();
  const polygonComponent = shallow(
    <FilterByPolygon setDrawFilterProperties={mockCallback} isDrawActive={false} />
  );
  expect(polygonComponent).toMatchSnapshot();
});

it('renders filter by polygon in middle of drawing', () => {
  const mockCallback = jest.fn();
  const polygonComponent = shallow(
    <FilterByPolygon setDrawFilterProperties={mockCallback} isDrawActive={true} />
  );
  expect(polygonComponent).toMatchSnapshot();
});
