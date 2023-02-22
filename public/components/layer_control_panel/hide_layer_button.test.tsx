/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const mockStyle = {
  layers: [
    {
      id: 'layer-1',
      type: 'fill',
      source: 'layer-1',
    },
  ],
};
// Need put this mock before import HideLayerButton, or it will not work
jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    getStyle: jest.fn(() => mockStyle),
    setLayoutProperty: jest.fn(),
  })),
}));

import { EuiButtonIcon } from '@elastic/eui';
import React from 'react';
import { LAYER_VISIBILITY } from '../../../common';
import { HideLayer } from './hide_layer_button';
import { MapLayerSpecification } from '../../model/mapLayerType';
import TestRenderer from 'react-test-renderer';
import { Map as MapLibre } from 'maplibre-gl';

describe('HideLayerButton', () => {
  it('should toggle layer visibility on button click', () => {
    const exampleLayer: MapLayerSpecification = {
      name: 'Layer 1',
      id: 'layer-1',
      type: 'opensearch_vector_tile_map',
      description: 'Some description',
      source: {
        dataURL: 'https:foo.bar',
      },
      style: {
        styleURL: 'https://example.com/style.json',
      },
      zoomRange: [0, 22],
      visibility: LAYER_VISIBILITY.VISIBLE,
      opacity: 100,
    };

    const map = new MapLibre({
      container: document.createElement('div'),
      style: {
        layers: [],
        version: 8 as 8,
        sources: {},
      },
    });

    const maplibreRef = {
      current: map,
    };

    const updateLayerVisibility = jest.fn();

    const hideButton = TestRenderer.create(
      <HideLayer
        layer={exampleLayer}
        maplibreRef={maplibreRef}
        updateLayerVisibility={updateLayerVisibility}
      />
    );

    const button = hideButton.root.findByType(EuiButtonIcon);

    expect(button.props.title).toBe('Hide layer');
    expect(button.props.iconType).toBe('eyeClosed');

    button.props.onClick();

    expect(button.props.title).toBe('Show layer');
    expect(button.props.iconType).toBe('eye');
    expect(updateLayerVisibility).toBeCalledTimes(1);
  });
});
