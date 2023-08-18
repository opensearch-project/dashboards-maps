/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { shallow } from 'enzyme';
import React from 'react';
import { SpatialFilterToolbar } from './filter_toolbar';
import { FILTER_DRAW_MODE } from '../../../../common';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';

// Mock the useOpenSearchDashboards hook
jest.mock('../../../../../../src/plugins/opensearch_dashboards_react/public');

describe('SpatialFilterToolbar tests', () => {
  beforeEach(() => {
    // Provide a default mock return value
    (useOpenSearchDashboards as jest.Mock).mockReturnValue({
      services: {
        uiSettings: {
          get: jest.fn().mockReturnValue(false), // default to light mode
        },
      },
    });
  });

  it('renders spatial filter before drawing', () => {
    const mockCallback = jest.fn();
    const toolbarComponent = shallow(
      <SpatialFilterToolbar setFilterProperties={mockCallback} mode={FILTER_DRAW_MODE.RECTANGLE} />
    );
    expect(toolbarComponent).toMatchSnapshot();
  });

  it('renders spatial filter while drawing', () => {
    const mockCallback = jest.fn();
    const toolbarComponent = shallow(
      <SpatialFilterToolbar setFilterProperties={mockCallback} mode={FILTER_DRAW_MODE.POLYGON} />
    );
    expect(toolbarComponent).toMatchSnapshot();
  });
});
