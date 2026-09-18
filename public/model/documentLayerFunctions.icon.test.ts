/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentLayerFunctions } from './documentLayerFunctions';
import { MaplibreRef } from './layersFunctions';
import { DocumentLayerSpecification } from './mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE, LAYER_VISIBILITY } from '../../common';

// Mock Image to make loadIconImage work in tests
class MockImage {
  width: number = 0;
  height: number = 0;
  src: string = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(width?: number, height?: number) {
    if (width) this.width = width;
    if (height) this.height = height;
    // Trigger onload asynchronously
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
}

// @ts-ignore
global.Image = MockImage;

const createMockMaplibre = () => ({
  addSource: jest.fn(),
  getSource: jest.fn().mockReturnValue(null),
  addLayer: jest.fn(),
  getLayer: jest.fn().mockReturnValue(undefined),
  removeLayer: jest.fn(),
  getStyle: jest.fn().mockReturnValue({ layers: [] }),
  setLayoutProperty: jest.fn(),
  setPaintProperty: jest.fn(),
  setLayerZoomRange: jest.fn(),
  hasImage: jest.fn().mockReturnValue(false),
  addImage: jest.fn(),
});

const createBaseDocumentLayerConfig = (styleOverrides?: any): DocumentLayerSpecification => ({
  name: 'Test Layer',
  id: 'test-layer-id',
  description: 'Test document layer',
  type: DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS,
  zoomRange: [0, 22],
  opacity: 70,
  visibility: LAYER_VISIBILITY.VISIBLE,
  source: {
    indexPatternRefName: 'test-index',
    indexPatternId: 'test-index-id',
    geoFieldType: 'geo_point',
    geoFieldName: 'location',
    documentRequestNumber: 1000,
    showTooltips: false,
    tooltipFields: [],
    useGeoBoundingBoxFilter: true,
    filters: [],
    applyGlobalFilters: true,
  },
  style: {
    fillColor: '#ff0000',
    borderColor: '#000000',
    borderThickness: 1,
    markerSize: 5,
    markerType: 'marker',
    ...styleOverrides,
  },
});

const sampleData = [
  {
    _source: {
      location: { lat: 40.7128, lon: -74.006 },
    },
  },
];

describe('DocumentLayerFunctions with icon support', () => {
  let mockMap: ReturnType<typeof createMockMaplibre>;
  let maplibreRef: MaplibreRef;

  beforeEach(() => {
    mockMap = createMockMaplibre();
    maplibreRef = {
      current: mockMap as any,
    };
    jest.clearAllMocks();
  });

  describe('marker mode (default)', () => {
    it('should add a circle layer when markerType is marker', () => {
      const layerConfig = createBaseDocumentLayerConfig();

      DocumentLayerFunctions.render(maplibreRef, layerConfig, sampleData, undefined);

      // Should add source (getSource returns null so addSource is called)
      expect(mockMap.addSource).toHaveBeenCalled();

      // Should add a circle layer
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'circle',
        })
      );
    });

    it('should not add an icon layer when markerType is marker', () => {
      const layerConfig = createBaseDocumentLayerConfig();

      DocumentLayerFunctions.render(maplibreRef, layerConfig, sampleData, undefined);

      // Should not have added a symbol layer with icon
      const addLayerCalls = mockMap.addLayer.mock.calls;
      const iconCalls = addLayerCalls.filter(
        (call: any[]) => call[0].type === 'symbol' && call[0].id?.includes('-icon')
      );
      expect(iconCalls.length).toBe(0);
    });
  });

  describe('icon mode', () => {
    it('should not add a circle layer when markerType is icon', async () => {
      const layerConfig = createBaseDocumentLayerConfig({
        markerType: 'icon',
        iconConfig: {
          iconId: 'pin',
          iconSize: 24,
        },
      });

      DocumentLayerFunctions.render(maplibreRef, layerConfig, sampleData, undefined);

      // Wait for async icon loading
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should NOT have added a circle layer
      const addLayerCalls = mockMap.addLayer.mock.calls;
      const circleCalls = addLayerCalls.filter(
        (call: any[]) => call[0].type === 'circle'
      );
      expect(circleCalls.length).toBe(0);
    });

    it('should add an icon (symbol) layer when markerType is icon', async () => {
      const layerConfig = createBaseDocumentLayerConfig({
        markerType: 'icon',
        iconConfig: {
          iconId: 'pin',
          iconSize: 24,
        },
      });

      DocumentLayerFunctions.render(maplibreRef, layerConfig, sampleData, undefined);

      // Wait for async icon loading
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should have loaded the image
      expect(mockMap.addImage).toHaveBeenCalled();

      // Should add a symbol layer with icon
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-layer-id-icon',
          type: 'symbol',
        })
      );
    });
  });
});
