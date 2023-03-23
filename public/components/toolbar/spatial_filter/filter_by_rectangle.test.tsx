/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { shallow } from 'enzyme';
import React from 'react';
import { FilterByRectangle } from './filter_by_rectangle';

it('renders filter by rectangle button', () => {
  const mockCallback = jest.fn();
  const component = shallow(
    <FilterByRectangle setDrawFilterProperties={mockCallback} isDrawActive={false} />
  );
  expect(component).toMatchSnapshot();
});

it('renders filter by rectangle in middle of drawing', () => {
  const mockCallback = jest.fn();
  const component = shallow(
    <FilterByRectangle setDrawFilterProperties={mockCallback} isDrawActive={true} />
  );
  expect(component).toMatchSnapshot();
});
