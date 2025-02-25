/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as MapLibre } from 'maplibre-gl';
import { ClusterLayerSpecification } from './mapLayerType';
import * as H3 from 'h3-js';
import * as DecodeUtils from '../utils/decode';
import { MaplibreRef } from './layersFunctions';
import * as LayerOperations from './map/layer_operations';

// Import the module with the function to test
import { ClusterLayerFunctions } from './clusterLayerFunctions';
import { MapsLegendHandle } from '../components/map_container/legend';

// Mock dependencies
jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => ({
    getCanvas: jest.fn(() => ({
      width: 800,
      height: 600,
      style: {
        width: '800px',
        height: '600px',
      },
    })),
    getZoom: jest.fn(() => 10),
    addSource: jest.fn(),
    getSource: jest.fn(),
  })),
}));

jest.mock('h3-js', () => ({
  cellToBoundary: jest.fn(() => [[37.1, -122.1]]),
  greatCircleDistance: jest.fn(() => 1000), // 1000 meters
  UNITS: { m: 'm' },
}));

jest.mock('../utils/decode', () => ({
  decodeGeoHash: jest.fn(() => [10, 20]),
  decodeGeoTile: jest.fn(() => ({ lat: 30, lon: 40, z: '10' })),
  decodeGeoHex: jest.fn(() => ({ lat: 50, lon: 60 })),
  latLngToBoundsToRadius: jest.fn(() => 0.1),
  metersToPixel: jest.fn(() => 5),
}));

jest.mock('./map/layer_operations', () => ({
  addCircleLayer: jest.fn(),
  addSymbolLayer: jest.fn(),
  createClusterLayerSymbolSpecification: jest.fn(() => ({
    id: 'test-layer-symbol',
    source: 'test-layer',
    type: 'symbol',
  })),
  hasLayer: jest.fn(),
  hasSymbolLayer: jest.fn(),
  updateCircleLayer: jest.fn(),
  updateSymbolLayer: jest.fn(),
}));

jest.mock('./layersFunctions', () => ({
  getMaplibreAboveLayerId: jest.fn(() => 'above-layer-id'),
}));

// Mock d3 with a proper quantize function
jest.mock('d3', () => {
  const mockQuantize = jest.fn((value) => '#6baed6');
  mockQuantize.domain = jest.fn().mockReturnThis();
  mockQuantize.range = jest.fn().mockReturnThis();
  mockQuantize.invertExtent = jest.fn().mockReturnValue([10, 20]);

  return {
    scale: {
      quantize: jest.fn(() => mockQuantize),
    },
  };
});

jest.mock('../services', () => ({
  getFormatService: jest.fn(() => ({
    deserialize: jest.fn(() => ({
      getConverterFor: jest.fn(() => (value: any) => `${value}`),
    })),
  })),
}));

jest.mock('../components/layer_config/cluster_config/config', () => ({
  MetricAggregations: [
    { value: 'count', label: 'Count' },
    { value: 'avg', label: 'Average' },
    { value: 'sum', label: 'Sum' },
  ],
  Palettes: [
    {
      value: 'Blues',
      palette: [
        { color: '#f7fbff' },
        { color: '#deebf7' },
        { color: '#c6dbef' },
        { color: '#9ecae1' },
        { color: '#6baed6' },
      ],
    },
  ],
}));

describe('clusterLayerFunctions', () => {
  let maplibreInstance: MapLibre;
  let maplibreRef: MaplibreRef;

  beforeEach(() => {
    maplibreInstance = new MapLibre({
      container: document.createElement('div'),
      style: 'mock-style-url',
    });

    maplibreRef = {
      current: maplibreInstance,
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('ClusterLayerFunctions.render', () => {
    it('should render a new cluster layer when the layer does not exist', () => {
      // Mock that the layer doesn't exist yet
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(false);
      (LayerOperations.hasSymbolLayer as jest.Mock).mockReturnValue(false);

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-cluster-layer',
        source: {
          cluster: {
            agg: 'geohash_grid',
            precision: 5,
            useCentroid: false,
          },
          metric: {
            agg: 'count',
            field: '',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000',
          fillType: 'solid',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: 'abcde',
              doc_count: 10,
            },
          ],
        },
      ];

      ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData);

      // Verify that addSource was called with the correct layer ID
      expect(maplibreInstance.addSource).toHaveBeenCalledWith(
        'test-cluster-layer',
        expect.any(Object)
      );

      // Verify that addCircleLayer was called
      expect(LayerOperations.addCircleLayer).toHaveBeenCalledWith(
        maplibreInstance,
        expect.objectContaining({
          fillColor: ['get', 'color'],
          opacity: 0.8,
          outlineColor: '#000000',
          sourceId: 'test-cluster-layer',
          visibility: 'visible',
        })
      );

      // Verify that addSymbolLayer was called for the label
      expect(LayerOperations.addSymbolLayer).toHaveBeenCalledWith(
        maplibreInstance,
        expect.any(Object),
        'above-layer-id'
      );
    });

    it('should update an existing cluster layer when the layer exists', () => {
      // Mock that the layer already exists
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(true);
      (LayerOperations.hasSymbolLayer as jest.Mock).mockReturnValue(true);

      // Mock the getSource to return a valid source with setData method
      const mockSetData = jest.fn();
      (maplibreInstance.getSource as jest.Mock).mockReturnValue({
        setData: mockSetData,
      });

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-cluster-layer',
        source: {
          cluster: {
            agg: 'geohash_grid',
            precision: 5,
            useCentroid: false,
          },
          metric: {
            agg: 'count',
            field: '',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000',
          fillType: 'solid',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: 'abcde',
              doc_count: 10,
            },
          ],
        },
      ];

      ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData);

      // Verify that setData was called on the existing source
      expect(mockSetData).toHaveBeenCalled();

      // Verify that updateCircleLayer was called
      expect(LayerOperations.updateCircleLayer).toHaveBeenCalledWith(
        maplibreInstance,
        expect.objectContaining({
          fillColor: ['get', 'color'],
          opacity: 0.8,
          outlineColor: '#000000',
          sourceId: 'test-cluster-layer',
          visibility: 'visible',
        })
      );

      // Verify that updateSymbolLayer was called for the label
      expect(LayerOperations.updateSymbolLayer).toHaveBeenCalledWith(
        maplibreInstance,
        expect.any(Object)
      );
    });

    it('should handle gradient fill type correctly', () => {
      // Mock that the layer doesn't exist yet
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(false);
      (LayerOperations.hasSymbolLayer as jest.Mock).mockReturnValue(false);

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-gradient-layer',
        source: {
          cluster: {
            agg: 'geohash_grid',
            precision: 5,
            useCentroid: false,
          },
          metric: {
            agg: 'sum',
            field: 'value',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000', // This won't be used for gradient
          fillType: 'gradient',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: 'abcde',
              doc_count: 5,
              1: { value: 10 }, // Metric value
            },
            {
              key: 'abcdf',
              doc_count: 8,
              1: { value: 20 }, // Metric value
            },
          ],
        },
      ];

      // Create a mock legend ref
      const mockUpdateLegends = jest.fn();
      const legendRef = {
        current: {
          updateLegends: mockUpdateLegends,
        } as unknown as MapsLegendHandle,
      };

      ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData, legendRef);

      // Verify that addSource was called with the correct layer ID
      expect(maplibreInstance.addSource).toHaveBeenCalledWith(
        'test-gradient-layer',
        expect.objectContaining({
          type: 'geojson',
        })
      );

      // Verify that the legend was updated
      expect(mockUpdateLegends).toHaveBeenCalled();
    });

    // Test different aggregation types through the render method
    it('should handle geohash_grid aggregation correctly', () => {
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(false);

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-geohash-layer',
        source: {
          cluster: {
            agg: 'geohash_grid',
            precision: 5,
            useCentroid: false,
          },
          metric: {
            agg: 'count',
            field: '',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000',
          fillType: 'solid',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: 'abcde',
              doc_count: 10,
            },
          ],
        },
      ];

      ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData);

      // Verify that decodeGeoHash was called with the correct key
      expect(DecodeUtils.decodeGeoHash).toHaveBeenCalledWith('abcde');
    });

    it('should handle geotile_grid aggregation correctly', () => {
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(false);

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-geotile-layer',
        source: {
          cluster: {
            agg: 'geotile_grid',
            useCentroid: false,
          },
          metric: {
            agg: 'count',
            field: '',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000',
          fillType: 'solid',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: '10/20/30',
              doc_count: 10,
            },
          ],
        },
      ];

      ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData);

      // Verify that decodeGeoTile was called with the correct key
      expect(DecodeUtils.decodeGeoTile).toHaveBeenCalledWith('10/20/30');
    });

    it('should handle geohex_grid aggregation correctly', () => {
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(false);

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-geohex-layer',
        source: {
          cluster: {
            agg: 'geohex_grid',
            useCentroid: false,
          },
          metric: {
            agg: 'count',
            field: '',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000',
          fillType: 'solid',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: '8928308280fffff',
              doc_count: 10,
            },
          ],
        },
      ];

      ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData);

      // Verify that decodeGeoHex was called with the correct key
      expect(DecodeUtils.decodeGeoHex).toHaveBeenCalledWith('8928308280fffff');
      expect(H3.cellToBoundary).toHaveBeenCalledWith('8928308280fffff', false);
    });

    it('should handle edge case when maxValue is 0', () => {
      (LayerOperations.hasLayer as jest.Mock).mockReturnValue(false);

      const layerConfig: ClusterLayerSpecification = {
        id: 'test-edge-case-layer',
        source: {
          cluster: {
            agg: 'geohash_grid',
            precision: 5,
            useCentroid: false,
          },
          metric: {
            agg: 'count',
            field: '',
            fieldType: 'number',
          },
        },
        style: {
          fillColor: '#ff0000',
          fillType: 'solid',
          borderColor: '#000000',
          borderThickness: 1,
          palette: 'Blues',
        },
        opacity: 0.8,
        visibility: 'visible',
        zoomRange: [0, 22],
      };

      const mockData = [
        {},
        {},
        {
          buckets: [
            {
              key: 'abcde',
              doc_count: 0, // Zero value
            },
          ],
        },
      ];

      // This should not throw an error
      expect(() => {
        ClusterLayerFunctions.render(maplibreRef, layerConfig, mockData);
      }).not.toThrow();
    });
  });
});
