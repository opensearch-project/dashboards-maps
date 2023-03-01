import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { MapsFooter } from './mapsFooter';
import { LngLat } from 'maplibre-gl';

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

it('renders with or without coordinates', () => {
  act(() => {
    render(<MapsFooter zoom={3} />, container);
  });
  expect(container?.textContent).toBe('zoom: 3');

  act(() => {
    const coordinates: LngLat = new LngLat(-73.974912, 40.773654);
    render(<MapsFooter zoom={3} coordinates={coordinates} />, container);
  });
  expect(container?.textContent).toBe('lat: 40.7737, lon: -73.9749, zoom: 3');
});
