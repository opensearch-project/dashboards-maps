import { Map as Maplibre } from 'maplibre-gl';

export type Visibility = 'visible' | 'none';

export interface LineLayerSpecification {
  sourceId: string;
  visibility: string;
  color: string;
  opacity: number;
  width: number;
  minZoom: number;
  maxZoom: number;
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
      paint: {
        'line-color': specification.color,
        'line-opacity': specification.opacity / 100,
        'line-width': specification.width,
      },
    },
    beforeId
  );
  map.setLayoutProperty(lineLayerId, 'visibility', specification.visibility);
  map.setLayerZoomRange(lineLayerId, specification.minZoom, specification.maxZoom);
  return lineLayerId;
};

export interface CircleLayerSpecification {
  sourceId: string;
  visibility: string;
  fillColor: string;
  outlineColor: string;
  radius: number;
  opacity: number;
  width: number;
  minZoom: number;
  maxZoom: number;
}

export const addCircleLayer = (
  map: Maplibre,
  specification: CircleLayerSpecification,
  beforeId?: string
): string => {
  const circleLayerId = specification.sourceId + 'circle';
  map.addLayer(
    {
      id: circleLayerId,
      type: 'circle',
      source: specification.sourceId,
      filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': specification.radius,
        'circle-color': specification.fillColor,
        'circle-opacity': specification.opacity / 100,
        'circle-stroke-width': specification.width,
        'circle-stroke-color': specification.outlineColor,
      },
    },
    beforeId
  );
  map.setLayoutProperty(circleLayerId, 'visibility', specification.visibility);
  map?.setLayerZoomRange(circleLayerId, specification.minZoom, specification.maxZoom);
  return circleLayerId;
};

export interface PolygonLayerSpecification {
  sourceId: string;
  visibility: string;
  fillColor: string;
  outlineColor: string;
  opacity: number;
  width: number;
  minZoom: number;
  maxZoom: number;
}

export const addPolygonLayer = (
  map: Maplibre,
  specification: PolygonLayerSpecification,
  beforeId?: string
) => {
  const fillLayerId = specification.sourceId + 'fill';
  map.addLayer(
    {
      id: fillLayerId,
      type: 'fill',
      source: specification.sourceId,
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'fill-color': specification.fillColor,
        'fill-opacity': specification.opacity / 100,
      },
    },
    beforeId
  );
  map?.setLayoutProperty(fillLayerId, 'visibility', specification.visibility);
  map?.setLayerZoomRange(fillLayerId, specification.minZoom, specification.maxZoom);

  // Due to limitations on WebGL, fill can't render outlines with width wider than 1,
  // so we have to create another style layer with type=line to apply width.
  const outlineId = specification.sourceId + 'fill-outline';
  map.addLayer(
    {
      id: outlineId,
      type: 'line',
      source: specification.sourceId,
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'line-color': specification.outlineColor,
        'line-opacity': specification.opacity / 100,
        'line-width': specification.width,
      },
    },
    beforeId
  );
  map.setLayoutProperty(outlineId, 'visibility', specification.visibility);
  map?.setLayerZoomRange(outlineId, specification.minZoom, specification.maxZoom);
};
