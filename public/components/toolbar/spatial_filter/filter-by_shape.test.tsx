/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import renderer from 'react-test-renderer';
import React from 'react';
import { FilterByShape } from './filter_by_shape';
import {
  DRAW_FILTER_POLYGON,
  DRAW_FILTER_POLYGON_DEFAULT_LABEL,
  DRAW_FILTER_RECTANGLE,
  DRAW_FILTER_RECTANGLE_DEFAULT_LABEL,
  FILTER_DRAW_MODE,
} from '../../../../common';

describe('render polygon', function () {
  it('renders filter by polygon option', () => {
    const mockCallback = jest.fn();
    const polygonComponent = renderer
      .create(
        <FilterByShape
          setDrawFilterProperties={mockCallback}
          mode={FILTER_DRAW_MODE.NONE}
          shapeMode={FILTER_DRAW_MODE.POLYGON}
          shapeLabel={DRAW_FILTER_POLYGON}
          defaultLabel={DRAW_FILTER_POLYGON_DEFAULT_LABEL}
          iconType={'vector'}
        />
      )
      .toJSON();
    expect(polygonComponent).toMatchSnapshot();
  });

  it('renders filter by polygon in middle of drawing', () => {
    const mockCallback = jest.fn();
    const polygonComponent = renderer
      .create(
        <FilterByShape
          setDrawFilterProperties={mockCallback}
          mode={FILTER_DRAW_MODE.POLYGON}
          shapeMode={FILTER_DRAW_MODE.POLYGON}
          shapeLabel={DRAW_FILTER_POLYGON}
          defaultLabel={DRAW_FILTER_POLYGON_DEFAULT_LABEL}
          iconType={'vector'}
        />
      )
      .toJSON();
    expect(polygonComponent).toMatchSnapshot();
  });
});

describe('render rectangle', function () {
  it('renders filter by rectangle option', () => {
    const mockCallback = jest.fn();
    const rectangle = renderer
      .create(
        <FilterByShape
          setDrawFilterProperties={mockCallback}
          mode={FILTER_DRAW_MODE.NONE}
          shapeMode={FILTER_DRAW_MODE.RECTANGLE}
          shapeLabel={DRAW_FILTER_RECTANGLE}
          defaultLabel={DRAW_FILTER_RECTANGLE_DEFAULT_LABEL}
          iconType={'vector'}
        />
      )
      .toJSON();
    expect(rectangle).toMatchSnapshot();
  });

  it('renders filter by rectangle in middle of drawing', () => {
    const mockCallback = jest.fn();
    const rectangle = renderer
      .create(
        <FilterByShape
          setDrawFilterProperties={mockCallback}
          mode={FILTER_DRAW_MODE.RECTANGLE}
          shapeMode={FILTER_DRAW_MODE.RECTANGLE}
          shapeLabel={DRAW_FILTER_RECTANGLE}
          defaultLabel={DRAW_FILTER_RECTANGLE_DEFAULT_LABEL}
          iconType={'vector'}
        />
      )
      .toJSON();
    expect(rectangle).toMatchSnapshot();
  });
});
