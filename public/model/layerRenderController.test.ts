/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { orderLayers } from './layerRenderController';
import { MockMaplibreMap } from './map/__mocks__/map';
import { MockLayer } from './map/__mocks__/layer';
import { MapLayerSpecification } from './mapLayerType';

describe('orderLayers', () => {
  const createMockMapLayer = (id: string): MapLayerSpecification => {
    return { id } as MapLayerSpecification;
  };

  it('should reorder layers when maplibre layer order does not match dashboard-maps order', () => {
    // Simulate: basemap layer is above document layer in maplibre (wrong order)
    const basemapMbLayer = new MockLayer('basemap-layer-1');
    const documentMbLayer = new MockLayer('document-layer-1-circle');
    // maplibre has document layer first, then basemap on top (wrong for the user's desired order)
    const mockMap = new MockMaplibreMap([documentMbLayer, basemapMbLayer]);

    // Dashboard-maps layer order: basemap first (bottom), document layer second (top)
    const mapLayers = [
      createMockMapLayer('basemap-layer-1'),
      createMockMapLayer('document-layer-1'),
    ];

    orderLayers(mapLayers, mockMap as unknown as Maplibre);

    // After ordering, basemap should be below document layer
    const orderedLayers = mockMap.getStyle().layers;
    expect(orderedLayers[0].id).toBe('basemap-layer-1');
    expect(orderedLayers[1].id).toBe('document-layer-1-circle');
  });

  it('should not call moveLayer when layers are already in correct order', () => {
    // Simulate: layers are already in correct order
    const basemapMbLayer = new MockLayer('basemap-layer-1');
    const documentMbLayer = new MockLayer('document-layer-1-circle');
    const mockMap = new MockMaplibreMap([basemapMbLayer, documentMbLayer]);

    const moveLayerSpy = jest.spyOn(mockMap, 'moveLayer');

    const mapLayers = [
      createMockMapLayer('basemap-layer-1'),
      createMockMapLayer('document-layer-1'),
    ];

    orderLayers(mapLayers, mockMap as unknown as Maplibre);

    // moveLayer should not have been called since order is already correct
    expect(moveLayerSpy).not.toHaveBeenCalled();
  });

  it('should handle multiple maplibre layers per dashboard-maps layer', () => {
    // Document layers often have multiple maplibre layers (circle, line, fill, symbol)
    const basemapMbLayer = new MockLayer('basemap-1');
    const docCircle = new MockLayer('doc-1-circle');
    const docLine = new MockLayer('doc-1-line');

    // Wrong order: doc layers are below basemap
    const mockMap = new MockMaplibreMap([docCircle, docLine, basemapMbLayer]);

    const mapLayers = [
      createMockMapLayer('basemap-1'),
      createMockMapLayer('doc-1'),
    ];

    orderLayers(mapLayers, mockMap as unknown as Maplibre);

    const orderedLayers = mockMap.getStyle().layers;
    expect(orderedLayers[0].id).toBe('basemap-1');
    expect(orderedLayers[1].id).toBe('doc-1-circle');
    expect(orderedLayers[2].id).toBe('doc-1-line');
  });

  it('should handle case where no maplibre layers exist yet', () => {
    const mockMap = new MockMaplibreMap([]);
    const moveLayerSpy = jest.spyOn(mockMap, 'moveLayer');

    const mapLayers = [
      createMockMapLayer('basemap-1'),
      createMockMapLayer('doc-1'),
    ];

    orderLayers(mapLayers, mockMap as unknown as Maplibre);

    expect(moveLayerSpy).not.toHaveBeenCalled();
  });
});
