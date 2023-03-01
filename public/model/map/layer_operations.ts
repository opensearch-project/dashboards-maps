/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { LayerSpecification, Map as Maplibre } from 'maplibre-gl';
import { DocumentLayerSpecification } from '../mapLayerType';

export const getLayers = (map: Maplibre, dashboardMapsLayerId?: string): LayerSpecification[] => {
  const layers: LayerSpecification[] = map.getStyle().layers;
  return dashboardMapsLayerId
    ? layers.filter((layer) => layer.id.includes(dashboardMapsLayerId))
    : layers;
};

export const hasLayer = (map: Maplibre, dashboardMapsLayerId: string): boolean => {
  const maplibreMapLayers = getLayers(map);
  for (const layer of maplibreMapLayers) {
    if (layer.id.includes(dashboardMapsLayerId)) {
      return true;
    }
  }
  return false;
};

export const moveLayers = (map: Maplibre, sourceId: string, beforeId?: string) => {
  const sourceLayers = getLayers(map, sourceId);
  if (!sourceLayers.length) {
    return;
  }
  const beforeLayers = beforeId ? getLayers(map, beforeId) : [];
  const topOfBeforeLayer = beforeLayers.length ? beforeLayers[0].id : undefined;
  sourceLayers.forEach((layer) => map?.moveLayer(layer.id, topOfBeforeLayer));
  return;
};

export const removeLayers = (map: Maplibre, layerId: string, removeSource?: boolean) => {
  getLayers(map, layerId).forEach((layer) => {
    map.removeLayer(layer.id);
  });
  // client might remove source if it is not required anymore.
  if (removeSource && map.getSource(layerId)) {
    map.removeSource(layerId);
  }
};

export const removeMbLayer = (map: Maplibre, mbLayerId: string) => {
  map.removeLayer(mbLayerId);
};

export const updateLayerVisibilityHandler = (
  map: Maplibre,
  layerId: string,
  visibility: string
) => {
  getLayers(map, layerId).forEach((layer) => {
    map.setLayoutProperty(layer.id, 'visibility', visibility);
  });
};

// Common properties that every DashboardMap layer contains
interface Layer {
  sourceId: string;
  opacity: number;
  minZoom: number;
  maxZoom: number;
}

export interface LineLayerSpecification extends Layer {
  visibility: string;
  color: string;
  width: number;
}

export const addLineLayer = (
  map: Maplibre,
  specification: LineLayerSpecification,
  beforeId?: string
): string => {
  const lineLayerId = specification.sourceId + '-line';
  map.addLayer(
    {
      id: lineLayerId,
      type: 'line',
      source: specification.sourceId,
      filter: ['==', '$type', 'LineString'],
    },
    beforeId
  );
  return updateLineLayer(map, specification, lineLayerId);
};

export const updateLineLayer = (
  map: Maplibre,
  specification: LineLayerSpecification,
  layerId?: string
): string => {
  const lineLayerId = layerId ? layerId : specification.sourceId + '-line';
  map.setPaintProperty(lineLayerId, 'line-opacity', specification.opacity / 100);
  map.setPaintProperty(lineLayerId, 'line-color', specification.color);
  map.setPaintProperty(lineLayerId, 'line-width', specification.width);
  map.setLayoutProperty(lineLayerId, 'visibility', specification.visibility);
  map.setLayerZoomRange(lineLayerId, specification.minZoom, specification.maxZoom);
  return lineLayerId;
};

export interface CircleLayerSpecification extends Layer {
  visibility: string;
  fillColor: string;
  outlineColor: string;
  radius: number;
  width: number;
}

export const addCircleLayer = (
  map: Maplibre,
  specification: CircleLayerSpecification,
  beforeId?: string
): string => {
  const circleLayerId = specification.sourceId + '-circle';
  map.addLayer(
    {
      id: circleLayerId,
      type: 'circle',
      source: specification.sourceId,
      filter: ['==', '$type', 'Point'],
    },
    beforeId
  );
  return updateCircleLayer(map, specification, circleLayerId);
};

export const updateCircleLayer = (
  map: Maplibre,
  specification: CircleLayerSpecification,
  layerId?: string
): string => {
  const circleLayerId = layerId ? layerId : specification.sourceId + '-circle';
  map.setLayoutProperty(circleLayerId, 'visibility', specification.visibility);
  map.setLayerZoomRange(circleLayerId, specification.minZoom, specification.maxZoom);
  map.setPaintProperty(circleLayerId, 'circle-opacity', specification.opacity / 100);
  map.setPaintProperty(circleLayerId, 'circle-color', specification.fillColor);
  map.setPaintProperty(circleLayerId, 'circle-stroke-color', specification.outlineColor);
  map.setPaintProperty(circleLayerId, 'circle-stroke-width', specification.width);
  map.setPaintProperty(circleLayerId, 'circle-stroke-opacity', specification.opacity / 100);
  map.setPaintProperty(circleLayerId, 'circle-radius', specification.radius);
  return circleLayerId;
};

export interface PolygonLayerSpecification extends Layer {
  visibility: string;
  fillColor: string;
  outlineColor: string;
  width: number;
}

export const addPolygonLayer = (
  map: Maplibre,
  specification: PolygonLayerSpecification,
  beforeId?: string
) => {
  const fillLayerId = specification.sourceId + '-fill';
  map.addLayer(
    {
      id: fillLayerId,
      type: 'fill',
      source: specification.sourceId,
      filter: ['==', '$type', 'Polygon'],
    },
    beforeId
  );
  updatePolygonFillLayer(map, specification, fillLayerId);

  // Due to limitations on WebGL, fill can't render outlines with width wider than 1,
  // so we have to create another style layer with type=line to apply width.
  const outlineId = fillLayerId + '-outline';
  map.addLayer(
    {
      id: outlineId,
      type: 'line',
      source: specification.sourceId,
      filter: ['==', '$type', 'Polygon'],
    },
    beforeId
  );
  updateLineLayer(
    map,
    {
      width: specification.width,
      color: specification.outlineColor,
      maxZoom: specification.maxZoom,
      minZoom: specification.minZoom,
      opacity: specification.opacity,
      sourceId: specification.sourceId,
      visibility: specification.visibility,
    },
    outlineId
  );
};

export const updatePolygonLayer = (map: Maplibre, specification: PolygonLayerSpecification) => {
  const fillLayerId: string = updatePolygonFillLayer(map, specification);
  const outlineLayerId: string = fillLayerId + '-outline';
  updateLineLayer(
    map,
    {
      width: specification.width,
      color: specification.outlineColor,
      maxZoom: specification.maxZoom,
      minZoom: specification.minZoom,
      opacity: specification.opacity,
      sourceId: specification.sourceId,
      visibility: specification.visibility,
    },
    outlineLayerId
  );
};

const updatePolygonFillLayer = (
  map: Maplibre,
  specification: PolygonLayerSpecification,
  layerId?: string
): string => {
  const fillLayerId = layerId ? layerId : specification.sourceId + '-fill';
  map.setLayoutProperty(fillLayerId, 'visibility', specification.visibility);
  map.setLayerZoomRange(fillLayerId, specification.minZoom, specification.maxZoom);
  map.setPaintProperty(fillLayerId, 'fill-opacity', specification.opacity / 100);
  map.setPaintProperty(fillLayerId, 'fill-color', specification.fillColor);
  return fillLayerId;
};

export interface SymbolLayerSpecification extends Layer {
  visibility: string;
  textFont: string[];
  textField: string;
  textSize: number;
  textColor: string;
  symbolBorderWidth: number;
  symbolBorderColor: string;
}

export const createSymbolLayerSpecification = (
  layerConfig: DocumentLayerSpecification
): SymbolLayerSpecification => {
  return {
    sourceId: layerConfig.id,
    visibility: layerConfig.visibility,
    textFont: ['Noto Sans Regular'],
    textField: layerConfig.style.labelTittle,
    textSize: layerConfig.style.labelSize,
    textColor: layerConfig.style.labelColor,
    minZoom: layerConfig.zoomRange[0],
    maxZoom: layerConfig.zoomRange[1],
    opacity: layerConfig.opacity,
    symbolBorderWidth: layerConfig.style.labelBorderWidth,
    symbolBorderColor: layerConfig.style.labelBorderColor,
  };
};

export const hasSymbolLayer = (map: Maplibre, layerId: string) => {
  return !!map.getLayer(layerId + '-symbol');
};

export const removeSymbolLayer = (map: Maplibre, layerId: string) => {
  map.removeLayer(layerId + '-symbol');
};

export const addSymbolLayer = (
  map: Maplibre,
  specification: SymbolLayerSpecification,
  beforeId?: string
): string => {
  const symbolLayerId = specification.sourceId + '-symbol';
  map.addLayer(
    {
      id: symbolLayerId,
      type: 'symbol',
      source: specification.sourceId,
    },
    beforeId
  );
  return updateSymbolLayer(map, specification);
};

export const updateSymbolLayer = (
  map: Maplibre,
  specification: SymbolLayerSpecification
): string => {
  const symbolLayerId = specification.sourceId + '-symbol';
  map.setLayoutProperty(symbolLayerId, 'text-font', specification.textFont);
  map.setLayoutProperty(symbolLayerId, 'text-field', specification.textField);
  map.setLayoutProperty(symbolLayerId, 'visibility', specification.visibility);
  map.setPaintProperty(symbolLayerId, 'text-opacity', specification.opacity / 100);
  map.setLayerZoomRange(symbolLayerId, specification.minZoom, specification.maxZoom);
  map.setPaintProperty(symbolLayerId, 'text-color', specification.textColor);
  map.setLayoutProperty(symbolLayerId, 'text-size', specification.textSize);
  map.setPaintProperty(symbolLayerId, 'text-halo-width', specification.symbolBorderWidth);
  map.setPaintProperty(symbolLayerId, 'text-halo-color', specification.symbolBorderColor);
  return symbolLayerId;
};
