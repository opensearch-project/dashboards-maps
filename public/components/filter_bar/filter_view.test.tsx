/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { shallow } from 'enzyme';
import React from 'react';
import { FilterView } from './filter_view';

describe('test filter display', function () {
  it('renders filter display on disabled', () => {
    const mockOnClick = jest.fn();
    const mockOnRemove = jest.fn();
    const filterBar = shallow(
      <FilterView
        isDisabled={true}
        valueLabel={'mylabel'}
        onClick={mockOnClick}
        onRemove={mockOnRemove}
      />
    );
    expect(filterBar).toMatchSnapshot();
  });
  it('renders filter display on enabled', () => {
    const mockOnClick = jest.fn();
    const mockOnRemove = jest.fn();
    const filterView = shallow(
      <FilterView
        isDisabled={false}
        valueLabel={'mylabel'}
        onClick={mockOnClick}
        onRemove={mockOnRemove}
      />
    );
    expect(filterView).toMatchSnapshot();
  });
});
