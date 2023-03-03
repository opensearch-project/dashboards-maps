/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { MapsFooter } from './maps_footer';
import { Map as Maplibre } from 'maplibre-gl';

let container: Element | null;
let mockMap: Maplibre;
const mockCallbackMap: Map<string, () => void> = new Map<string, () => void>();
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  mockCallbackMap.clear();
  mockMap = ({
    on: (eventType: string, callback: () => void) => {
      mockCallbackMap.set(eventType, callback);
    },
    off: (eventType: string, callback: () => void) => {
      mockCallbackMap.delete(eventType);
    },
  } as unknown) as Maplibre;
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container?.remove();
  container = null;
});

it('renders map footer', () => {
  act(() => {
    render(<MapsFooter map={mockMap} zoom={2} />, container);
  });
  expect(container?.textContent).toBe('zoom: 2');
  expect(mockCallbackMap.size).toEqual(1);
});

it('clean up is called', () => {
  act(() => {
    render(<MapsFooter map={mockMap} zoom={4} />, container);
  });
  unmountComponentAtNode(container!);
  expect(mockCallbackMap.size).toEqual(0);
});
