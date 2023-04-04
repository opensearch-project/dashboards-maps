/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as MapLibre } from 'maplibre-gl';

jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => ({
    getCanvas: jest.fn(() => {
      return {
        style: {
          cursor: '',
        },
      };
    }),
  })),
}));

import { DrawFilterShapeHelper } from './display_draw_helper';
import React from 'react';
import { FILTER_DRAW_MODE } from '../../../../common';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from 'react-dom';
import TestRenderer from 'react-test-renderer';
import { EuiButton } from '@elastic/eui';

let container: Element | null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container?.remove();
  container = null;
});

describe('test draw filter helper displays valid content', function () {
  it('renders filter by polygon helper content', () => {
    const mockCallback = jest.fn();
    const map = new MapLibre({
      container: document.createElement('div'),
      style: {
        layers: [],
        version: 8 as 8,
        sources: {},
      },
    });
    act(() => {
      render(
        <DrawFilterShapeHelper mode={FILTER_DRAW_MODE.POLYGON} onCancel={mockCallback} map={map} />,
        container
      );
    });
    expect(container?.textContent).toBe(
      'Click to start shape. Click for vertex. Double click to finish.Cancel'
    );
  });
  it('renders filter by rectangle helper content', () => {
    const mockCallback = jest.fn();
    const map = new MapLibre({
      container: document.createElement('div'),
      style: {
        layers: [],
        version: 8 as 8,
        sources: {},
      },
    });
    act(() => {
      render(
        <DrawFilterShapeHelper
          mode={FILTER_DRAW_MODE.RECTANGLE}
          onCancel={mockCallback}
          map={map}
        />,
        container
      );
    });
    expect(container?.textContent).toBe(
      'Click to start rectangle. Move mouse to adjust size. Click to finish.Cancel'
    );
  });
  it('dont render helper content', () => {
    const mockCallback = jest.fn();
    const map = new MapLibre({
      container: document.createElement('div'),
      style: {
        layers: [],
        version: 8 as 8,
        sources: {},
      },
    });
    act(() => {
      render(
        <DrawFilterShapeHelper mode={FILTER_DRAW_MODE.NONE} onCancel={mockCallback} map={map} />,
        container
      );
    });
    expect(container?.textContent).toBe('');
  });
  it('check cancel is called', () => {
    const mockCallback = jest.fn();
    const map = new MapLibre({
      container: document.createElement('div'),
      style: {
        layers: [],
        version: 8 as 8,
        sources: {},
      },
    });
    const helper = TestRenderer.create(
      <DrawFilterShapeHelper mode={FILTER_DRAW_MODE.POLYGON} onCancel={mockCallback} map={map} />
    );
    const button = helper.root.findByType(EuiButton);
    button.props.onClick();
    expect(mockCallback).toBeCalledTimes(1);
  });
});
