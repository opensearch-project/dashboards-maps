/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  addCircleLayer,
  addLineLayer,
  addPolygonLayer,
  getLayers,
  hasLayer,
  moveLayers,
  removeLayers,
  updateCircleLayer,
  updateLineLayer,
  updatePolygonLayer,
  updateLayerVisibilityHandler,
} from './layer_operations';
import { Map as Maplibre } from 'maplibre-gl';
import { MockMaplibreMap } from './__mocks__/map';
import { MockLayer } from './__mocks__/layer';

describe('Circle layer', () => {
  it('add new circle layer', () => {
    const mockMap = new MockMaplibreMap([]);
    const sourceId: string = 'geojson-source';
    const expectedLayerId: string = sourceId + '-circle';
    expect(mockMap.getLayer(expectedLayerId).length).toBe(0);
    expect(
      addCircleLayer(mockMap as unknown as Maplibre, {
        maxZoom: 10,
        minZoom: 2,
        opacity: 60,
        outlineColor: 'green',
        radius: 10,
        sourceId,
        visibility: 'visible',
        width: 2,
        fillColor: 'red',
      })
    ).toBe(expectedLayerId);
    expect(mockMap.getLayer(sourceId).length).toBe(1);

    const addedLayer = mockMap.getLayer(sourceId)[0];

    expect(addedLayer.getProperty('id')).toBe(expectedLayerId);
    expect(addedLayer.getProperty('visibility')).toBe('visible');
    expect(addedLayer.getProperty('source')).toBe(sourceId);
    expect(addedLayer.getProperty('type')).toBe('circle');
    expect(addedLayer.getProperty('filter')).toEqual(['==', '$type', 'Point']);
    expect(addedLayer.getProperty('minZoom')).toBe(2);
    expect(addedLayer.getProperty('maxZoom')).toBe(10);
    expect(addedLayer.getProperty('circle-opacity')).toBe(0.6);
    expect(addedLayer.getProperty('circle-color')).toBe('red');
    expect(addedLayer.getProperty('circle-stroke-color')).toBe('green');
    expect(addedLayer.getProperty('circle-stroke-width')).toBe(2);
    expect(addedLayer.getProperty('circle-radius')).toBe(10);
  });

  it('update circle layer', () => {
    const mockMap = new MockMaplibreMap([]);
    const sourceId: string = 'geojson-source';

    // add layer first
    const addedLayerId: string = addCircleLayer(mockMap as unknown as Maplibre, {
      maxZoom: 10,
      minZoom: 2,
      opacity: 60,
      outlineColor: 'green',
      radius: 10,
      sourceId,
      visibility: 'visible',
      width: 2,
      fillColor: 'red',
    });
    expect(
      updateCircleLayer(mockMap as unknown as Maplibre, {
        maxZoom: 12,
        minZoom: 4,
        opacity: 80,
        outlineColor: 'yellow',
        radius: 8,
        sourceId,
        visibility: 'none',
        width: 7,
        fillColor: 'blue',
      })
    ).toBe(addedLayerId);
    expect(mockMap.getLayer(addedLayerId).length).toBe(1);

    const updatedLayer = mockMap.getLayer(addedLayerId)[0];
    expect(updatedLayer.getProperty('id')).toBe(addedLayerId);
    expect(updatedLayer.getProperty('visibility')).toBe('none');
    expect(updatedLayer.getProperty('source')).toBe(sourceId);
    expect(updatedLayer.getProperty('type')).toBe('circle');
    expect(updatedLayer.getProperty('filter')).toEqual(['==', '$type', 'Point']);
    expect(updatedLayer.getProperty('minZoom')).toBe(4);
    expect(updatedLayer.getProperty('maxZoom')).toBe(12);
    expect(updatedLayer.getProperty('circle-opacity')).toBe(0.8);
    expect(updatedLayer.getProperty('circle-color')).toBe('blue');
    expect(updatedLayer.getProperty('circle-stroke-color')).toBe('yellow');
    expect(updatedLayer.getProperty('circle-stroke-width')).toBe(7);
    expect(updatedLayer.getProperty('circle-radius')).toBe(8);
  });
});

describe('Line layer', () => {
  it('add new Line layer', () => {
    const mockMap = new MockMaplibreMap([]);
    const sourceId: string = 'geojson-source';
    const expectedLayerId: string = sourceId + '-line';
    expect(mockMap.getLayer(expectedLayerId).length).toBe(0);
    expect(
      addLineLayer(mockMap as unknown as Maplibre, {
        color: 'red',
        maxZoom: 10,
        minZoom: 2,
        opacity: 60,
        sourceId,
        visibility: 'visible',
        width: 2,
      })
    ).toBe(expectedLayerId);
    expect(mockMap.getLayer(sourceId).length).toBe(1);
    const addedLayer = mockMap.getLayer(sourceId)[0];
    expect(addedLayer.getProperty('id')).toBe(expectedLayerId);
    expect(addedLayer.getProperty('visibility')).toBe('visible');
    expect(addedLayer.getProperty('source')).toBe(sourceId);
    expect(addedLayer.getProperty('type')).toBe('line');
    expect(addedLayer.getProperty('filter')).toEqual(['==', '$type', 'LineString']);
    expect(addedLayer.getProperty('minZoom')).toBe(2);
    expect(addedLayer.getProperty('maxZoom')).toBe(10);
    expect(addedLayer.getProperty('line-opacity')).toBe(0.6);
    expect(addedLayer.getProperty('line-color')).toBe('red');
    expect(addedLayer.getProperty('line-width')).toBe(2);
  });

  it('update line layer', () => {
    const mockMap = new MockMaplibreMap([]);
    const sourceId: string = 'geojson-source';

    // add layer first
    const addedLineLayerId: string = addLineLayer(mockMap as unknown as Maplibre, {
      color: 'red',
      maxZoom: 10,
      minZoom: 2,
      opacity: 60,
      sourceId,
      visibility: 'visible',
      width: 2,
    });
    expect(
      updateLineLayer(mockMap as unknown as Maplibre, {
        color: 'blue',
        maxZoom: 12,
        minZoom: 4,
        opacity: 80,
        sourceId,
        visibility: 'none',
        width: 12,
      })
    ).toBe(addedLineLayerId);
    expect(mockMap.getLayer(addedLineLayerId).length).toBe(1);

    const updatedLayer = mockMap.getLayer(addedLineLayerId)[0];
    expect(updatedLayer.getProperty('id')).toBe(addedLineLayerId);
    expect(updatedLayer.getProperty('visibility')).toBe('none');
    expect(updatedLayer.getProperty('source')).toBe(sourceId);
    expect(updatedLayer.getProperty('type')).toBe('line');
    expect(updatedLayer.getProperty('filter')).toEqual(['==', '$type', 'LineString']);
    expect(updatedLayer.getProperty('minZoom')).toBe(4);
    expect(updatedLayer.getProperty('maxZoom')).toBe(12);
    expect(updatedLayer.getProperty('line-opacity')).toBe(0.8);
    expect(updatedLayer.getProperty('line-color')).toBe('blue');
    expect(updatedLayer.getProperty('line-width')).toBe(12);
  });
});

describe('Polygon layer', () => {
  it('add new polygon layer', () => {
    const mockMap = new MockMaplibreMap([]);
    const sourceId: string = 'geojson-source';
    const expectedFillLayerId = sourceId + '-fill';
    const expectedOutlineLayerId = expectedFillLayerId + '-outline';
    expect(mockMap.getLayer(expectedFillLayerId).length).toBe(0);
    expect(mockMap.getLayer(expectedOutlineLayerId).length).toBe(0);
    addPolygonLayer(mockMap as unknown as Maplibre, {
      maxZoom: 10,
      minZoom: 2,
      opacity: 60,
      outlineColor: 'green',
      sourceId,
      visibility: 'visible',
      width: 2,
      fillColor: 'red',
    });
    expect(mockMap.getLayer(sourceId).length).toBe(2);

    const fillLayer = mockMap
      .getLayer(sourceId)
      .filter((layer) => layer.getProperty('id').toString().endsWith('-fill'))[0];

    expect(fillLayer.getProperty('id')).toBe(expectedFillLayerId);
    expect(fillLayer.getProperty('visibility')).toBe('visible');
    expect(fillLayer.getProperty('source')).toBe(sourceId);
    expect(fillLayer.getProperty('type')).toBe('fill');
    expect(fillLayer.getProperty('filter')).toEqual(['==', '$type', 'Polygon']);
    expect(fillLayer.getProperty('minZoom')).toBe(2);
    expect(fillLayer.getProperty('maxZoom')).toBe(10);
    expect(fillLayer.getProperty('fill-opacity')).toBe(0.6);
    expect(fillLayer.getProperty('fill-color')).toBe('red');
    const outlineLayer = mockMap
      .getLayer(sourceId)
      .filter((layer) => layer.getProperty('id').toString().endsWith('-fill-outline'))[0];
    expect(outlineLayer.getProperty('id')).toBe(expectedOutlineLayerId);
    expect(outlineLayer.getProperty('visibility')).toBe('visible');
    expect(outlineLayer.getProperty('source')).toBe(sourceId);
    expect(outlineLayer.getProperty('type')).toBe('line');
    expect(outlineLayer.getProperty('filter')).toEqual(['==', '$type', 'Polygon']);
    expect(outlineLayer.getProperty('minZoom')).toBe(2);
    expect(outlineLayer.getProperty('maxZoom')).toBe(10);
    expect(outlineLayer.getProperty('line-opacity')).toBe(0.6);
    expect(outlineLayer.getProperty('line-color')).toBe('green');
    expect(outlineLayer.getProperty('line-width')).toBe(2);
  });

  it('update polygon layer', () => {
    const mockMap = new MockMaplibreMap([]);
    const sourceId: string = 'geojson-source';

    const expectedFillLayerId = sourceId + '-fill';
    const expectedOutlineLayerId = expectedFillLayerId + '-outline';
    // add layer first
    addPolygonLayer(mockMap as unknown as Maplibre, {
      maxZoom: 10,
      minZoom: 2,
      opacity: 60,
      outlineColor: 'green',
      sourceId,
      visibility: 'visible',
      width: 2,
      fillColor: 'red',
    });

    expect(mockMap.getLayer(sourceId).length).toBe(2);
    // update polygon for test
    updatePolygonLayer(mockMap as unknown as Maplibre, {
      maxZoom: 12,
      minZoom: 4,
      opacity: 80,
      outlineColor: 'yellow',
      sourceId,
      visibility: 'none',
      width: 7,
      fillColor: 'blue',
    });

    expect(mockMap.getLayer(sourceId).length).toBe(2);
    const fillLayer = mockMap
      .getLayer(sourceId)
      .filter((layer) => layer.getProperty('id') === expectedFillLayerId)[0];

    expect(fillLayer.getProperty('id')).toBe(expectedFillLayerId);
    expect(fillLayer.getProperty('visibility')).toBe('none');
    expect(fillLayer.getProperty('source')).toBe(sourceId);
    expect(fillLayer.getProperty('type')).toBe('fill');
    expect(fillLayer.getProperty('filter')).toEqual(['==', '$type', 'Polygon']);
    expect(fillLayer.getProperty('minZoom')).toBe(4);
    expect(fillLayer.getProperty('maxZoom')).toBe(12);
    expect(fillLayer.getProperty('fill-opacity')).toBe(0.8);
    expect(fillLayer.getProperty('fill-color')).toBe('blue');
    const outlineLayer = mockMap
      .getLayer(sourceId)
      .filter((layer) => layer.getProperty('id') === expectedOutlineLayerId)[0];
    expect(outlineLayer.getProperty('id')).toBe(expectedOutlineLayerId);
    expect(outlineLayer.getProperty('visibility')).toBe('none');
    expect(outlineLayer.getProperty('source')).toBe(sourceId);
    expect(outlineLayer.getProperty('type')).toBe('line');
    expect(outlineLayer.getProperty('filter')).toEqual(['==', '$type', 'Polygon']);
    expect(outlineLayer.getProperty('minZoom')).toBe(4);
    expect(outlineLayer.getProperty('maxZoom')).toBe(12);
    expect(outlineLayer.getProperty('line-opacity')).toBe(0.8);
    expect(outlineLayer.getProperty('line-color')).toBe('yellow');
    expect(outlineLayer.getProperty('line-width')).toBe(7);
  });
});

describe('get layer', () => {
  it('should get layer successfully', function () {
    const mockLayer: MockLayer = new MockLayer('layer-1');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer]);
    const actualLayers = getLayers(mockMap as unknown as Maplibre, 'layer-1');
    expect(actualLayers.length).toBe(1);
    expect(actualLayers[0].id).toBe(mockLayer.getProperty('id'));
  });

  it('should confirm no layer exists', function () {
    const mockLayer: MockLayer = new MockLayer('layer-1');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer]);
    expect(hasLayer(mockMap as unknown as Maplibre, 'layer-2')).toBe(false);
  });

  it('should confirm layer exists', function () {
    const mockLayer: MockLayer = new MockLayer('layer-1');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer]);
    expect(hasLayer(mockMap as unknown as Maplibre, 'layer-1')).toBe(true);
  });
});

describe('move layer', () => {
  it('should move to top', function () {
    const mockLayer1: MockLayer = new MockLayer('layer-1');
    const mockLayer2: MockLayer = new MockLayer('layer-11');
    const mockLayer3: MockLayer = new MockLayer('layer-2');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer1, mockLayer2, mockLayer3]);
    moveLayers(mockMap as unknown as Maplibre, 'layer-1');
    const reorderedLayer: string[] = mockMap.getLayers().map((layer) => layer.getProperty('id'));
    expect(reorderedLayer).toEqual(['layer-2', 'layer-1', 'layer-11']);
  });
  it('should move before middle layer', function () {
    const mockLayer1: MockLayer = new MockLayer('layer-1');
    const mockLayer2: MockLayer = new MockLayer('layer-2');
    const mockLayer3: MockLayer = new MockLayer('layer-3');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer1, mockLayer2, mockLayer3]);
    moveLayers(mockMap as unknown as Maplibre, 'layer-1', 'layer-2');
    const reorderedLayer: string[] = mockMap.getLayers().map((layer) => layer.getProperty('id'));
    expect(reorderedLayer).toEqual(['layer-2', 'layer-1', 'layer-3']);
  });
  it('should not move if no layer is matched', function () {
    const mockLayer1: MockLayer = new MockLayer('layer-1');
    const mockLayer2: MockLayer = new MockLayer('layer-2');
    const mockLayer3: MockLayer = new MockLayer('layer-3');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer1, mockLayer2, mockLayer3]);
    moveLayers(mockMap as unknown as Maplibre, 'layer-4', 'layer-2');
    const reorderedLayer: string[] = mockMap.getLayers().map((layer) => layer.getProperty('id'));
    expect(reorderedLayer).toEqual(['layer-1', 'layer-2', 'layer-3']);
  });
});

describe('delete layer', function () {
  it('should delete layer without source', function () {
    const mockLayer1: MockLayer = new MockLayer('layer-1');
    const mockLayer2: MockLayer = new MockLayer('layer-11');
    const mockLayer3: MockLayer = new MockLayer('layer-2');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer1, mockLayer2, mockLayer3]);
    mockMap.addSource('layer-1', 'geojson');
    removeLayers(mockMap as unknown as Maplibre, 'layer-1');
    expect(mockMap.getLayers().length).toBe(1);
    expect(mockMap.getSource('layer-1')).toBeDefined();
    expect(mockMap.getLayers()[0].getProperty('id')).toBe('layer-2');
  });
  it('should delete layer with source', function () {
    const mockLayer1: MockLayer = new MockLayer('layer-1');
    const mockLayer2: MockLayer = new MockLayer('layer-11');
    const mockLayer3: MockLayer = new MockLayer('layer-2');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer1, mockLayer2, mockLayer3]);
    mockMap.addSource('layer-2', 'geojson');
    removeLayers(mockMap as unknown as Maplibre, 'layer-2', true);
    expect(mockMap.getLayers().length).toBe(2);
    expect(mockMap.getSource('layer-2')).toBeUndefined();
    expect(
      mockMap.getLayers().filter((layer) => String(layer?.getProperty('id')) === 'layer-2')
    ).toEqual([]);
  });
});

describe('update visibility', function () {
  it('should update visibility for given layer', function () {
    const mockLayer1: MockLayer = new MockLayer('layer-1');
    const mockLayer2: MockLayer = new MockLayer('layer-11');
    mockLayer1.setProperty('visibility', 'none');
    const mockMap: MockMaplibreMap = new MockMaplibreMap([mockLayer1, mockLayer2]);
    updateLayerVisibilityHandler(mockMap as unknown as Maplibre, 'layer-1', 'visible');
    expect(mockMap.getLayers().map((layer) => String(layer.getProperty('visibility')))).toEqual(
      Array(2).fill('visible')
    );
  });
});
