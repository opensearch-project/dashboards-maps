/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { shallow } from 'enzyme';
import React from 'react';
import { SpatialFilterToolbar } from './filter_toolbar';

it('renders spatial filter before drawing', () => {
  const mockCallback = jest.fn();
  const toolbarComponent = shallow(
    <SpatialFilterToolbar setFilterProperties={mockCallback} isDrawActive={false} />
  );
  expect(toolbarComponent).toMatchSnapshot();
});

it('renders spatial filter while drawing', () => {
  const mockCallback = jest.fn();
  const toolbarComponent = shallow(
    <SpatialFilterToolbar setFilterProperties={mockCallback} isDrawActive={true} />
  );
  expect(toolbarComponent).toMatchSnapshot();
});
