/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { shallow } from 'enzyme';
import React from 'react';
import { FilterEditor } from './filter_editor';

it('renders one filter inside filter bar', () => {
  const mockOnSubmitCallback = jest.fn();
  const mockOnCancelCallback = jest.fn();
  const filterEditor = shallow(
    <FilterEditor
      content={JSON.stringify('{}')}
      label={'mylabel'}
      onCancel={mockOnCancelCallback}
      onSubmit={mockOnSubmitCallback}
    />
  );
  expect(filterEditor).toMatchSnapshot();
});
