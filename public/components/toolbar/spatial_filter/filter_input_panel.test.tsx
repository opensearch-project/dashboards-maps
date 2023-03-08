/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiButton, EuiForm, EuiFormRow, EuiPanel, EuiSelect } from '@elastic/eui';

import { FilterInputPanel } from './filter_input_panel';
import { FILTER_DRAW_MODE } from '../../../../common';
import { shallow } from 'enzyme';

it('renders filter input panel', () => {
  const mockRelations: string[] = ['sample', 'list', 'of', 'relations'];
  const mockCallback = jest.fn();
  const wrapper = shallow(
    <FilterInputPanel
      mode={FILTER_DRAW_MODE.POLYGON}
      relations={mockRelations}
      defaultFilterLabel={'mock-label'}
      onSubmit={mockCallback}
      drawLabel={'random-shape'}
    />
  );

  const panel = wrapper.find(EuiPanel);
  expect(panel.find(EuiForm).find(EuiFormRow).length).toEqual(3);
  wrapper.find(EuiButton).simulate('click', {});
  expect(mockCallback).toHaveBeenCalledTimes(1);
  const actualRelations = wrapper.find(EuiSelect).prop('options');
  expect(actualRelations).toEqual([
    {
      value: 'sample',
      text: 'sample',
    },
    {
      value: 'list',
      text: 'list',
    },
    {
      value: 'of',
      text: 'of',
    },
    {
      value: 'relations',
      text: 'relations',
    },
  ]);
});
