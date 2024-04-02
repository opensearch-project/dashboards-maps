/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { applyZoomRangeToLayer, CustomLayerFunctions } from './customLayerFunctions';
import { MaplibreRef } from './layersFunctions';
import { Map as MapLibre } from 'maplibre-gl';
import { CustomLayerSpecification } from './mapLayerType';
import { DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE } from '../../common';

const mockStyle = {
  layers: [
    {
      id: 'existing-layer',
      type: 'raster',
      source: 'existing-layer',
      layout: {
        visibility: 'visible',
      },
    },
  ],
  sources: {
    'existing-layer': {
      type: 'raster',
      tiles: ['https://example.com/tiles/{z}/{x}/{y}.png'],
    },
  },
};

jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    getStyle: jest.fn(() => mockStyle),
    setPaintProperty: jest.fn(),
    setLayerZoomRange: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    // @ts-ignore
    getSource: jest.fn().mockImplementation((id) => mockStyle.sources[id]),
    getLayer: jest
      .fn()
      .mockImplementation((id) => mockStyle.layers.find((layer) => layer.id === id)),
    triggerRepaint: jest.fn(),
    _controls: [],
    style: {
      sourceCaches: {},
    },
  })),
}));

describe('CustomLayerFunctions', () => {
  let map: MapLibre;
  let maplibreRef: MaplibreRef;

  beforeEach(() => {
    map = new MapLibre({
      container: document.createElement('div'),
      style: 'mock-style-url',
    });

    // Initialize sourceCaches with a mock function for each layer that might be accessed
    // @ts-ignore
    map.style.sourceCaches['existing-layer'] = {
      clearTiles: jest.fn(),
      update: jest.fn(),
    };

    maplibreRef = {
      current: map,
    };
  });

  it('should add a new layer if it does not exist', () => {
    const newLayerConfig: CustomLayerSpecification = {
      id: 'new-layer',
      source: {
        // @ts-ignore
        type: DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE.TMS,
        tiles: ['https://newtiles.example.com/{z}/{x}/{y}.png'],
        attribution: 'Test Attribution',
      },
      opacity: 80,
      zoomRange: [0, 22],
      visibility: 'visible',
    };

    CustomLayerFunctions.render(maplibreRef, newLayerConfig);

    expect(map.addSource).toHaveBeenCalledWith(newLayerConfig.id, expect.any(Object));
    expect(map.addLayer).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should update an existing layer', () => {
    const updatedLayerConfig: CustomLayerSpecification = {
      id: 'existing-layer',
      source: {
        // @ts-ignore
        type: DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE.TMS,
        tiles: ['https://updatedtiles.example.com/{z}/{x}/{y}.png'],
        attribution: 'Updated Test Attribution',
      },
      opacity: 50,
      zoomRange: [0, 15],
      visibility: 'visible',
    };

    CustomLayerFunctions.render(maplibreRef, updatedLayerConfig);

    expect(map.setPaintProperty).toHaveBeenCalledWith(
      updatedLayerConfig.id,
      'raster-opacity',
      updatedLayerConfig.opacity / 100
    );
    expect(map.setLayerZoomRange).toHaveBeenCalledWith(
      updatedLayerConfig.id,
      updatedLayerConfig.zoomRange[0],
      updatedLayerConfig.zoomRange[1]
    );
  });

  it('should convert zoomRange to a numeric array', () => {
    const layerConfig = {
      id: 'test-layer',
      // Assuming zoomRange might be provided as strings from old versions
      zoomRange: ['0', '10'],
    };

    // @ts-ignore
    const result = applyZoomRangeToLayer(layerConfig);

    // Expected result should be a numeric array
    const expectedResult = [0, 10];

    // Verify the result matches the expected numeric array
    expect(result).toEqual(expectedResult);
  });

  it('should handle mixed types in zoomRange', () => {
    // Define layerConfig with zoomRange as a mix of numbers and strings
    const layerConfig = {
      id: 'mixed-type-layer',
      zoomRange: [1, '15'],
    };

    // @ts-ignore
    const result = applyZoomRangeToLayer(layerConfig);

    const expectedResult = [1, 15];

    expect(result).toEqual(expectedResult);
  });
});
