/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { parse } from 'wellknown';
import { DocumentLayerSpecification } from './mapLayerType';
import { convertGeoPointToGeoJSON, isGeoJSON } from '../utils/geo_formater';
import { getMaplibreBeforeLayerId, layerExistInMbSource } from './layersFunctions';

interface MaplibreRef {
  current: Maplibre | null;
}
// https://opensearch.org/docs/1.3/opensearch/supported-field-types/geo-shape
const openSearchGeoJSONMap = new Map<string, string>([
  ['point', 'Point'],
  ['linestring', 'LineString'],
  ['polygon', 'Polygon'],
  ['multipoint', 'MultiPoint'],
  ['multilinestring', 'MultiLineString'],
  ['multipolygon', 'MultiPolygon'],
  ['geometrycollection', 'GeometryCollection'],
]);

const buildLayerSuffix = (layerId: string, mapLibreType: string) => {
  if (mapLibreType.toLowerCase() === 'circle') {
    return layerId;
  }
  if (mapLibreType.toLowerCase() === 'line') {
    return layerId + '-line';
  }
  if (mapLibreType.toLowerCase() === 'fill') {
    return layerId + '-fill';
  }
  if (mapLibreType.toLowerCase() === 'fill-outline') {
    return layerId + '-outline';
  }
  // if unknown type is found, use layerId as default
  return layerId;
};

const getFieldValue = (data: any, name: string) => {
  if (!name) {
    return null;
  }
  const keys = name.split('.');
  return keys.reduce((pre, cur) => {
    return pre?.[cur];
  }, data);
};

const getCurrentStyleLayers = (maplibreRef: MaplibreRef) => {
  return maplibreRef.current?.getStyle().layers || [];
};

const getGeoFieldType = (layerConfig: DocumentLayerSpecification) => {
  return layerConfig?.source?.geoFieldType;
};

const getGeoFieldName = (layerConfig: DocumentLayerSpecification) => {
  return layerConfig?.source?.geoFieldName;
};

const buildGeometry = (fieldType: string, location: any) => {
  if (isGeoJSON(location)) {
    return {
      type: openSearchGeoJSONMap.get(location.type?.toLowerCase()),
      coordinates: location.coordinates,
    };
  }

  if (typeof location === 'string') {
    // Check if location is WKT format
    const geometry = parse(location);
    if (geometry) {
      return geometry;
    }
  }
  // Geopoint supports other format like object, string, array,
  if (fieldType === 'geo_point') {
    // convert other supported formats to GeoJSON
    return convertGeoPointToGeoJSON(location);
  }
  // We don't support any other format
  return undefined;
};

const buildProperties = (document: any, fields: string[]) => {
  const property: { [name: string]: any } = {};
  if (!fields) {
    return property;
  }
  fields.forEach((field) => {
    const fieldValue = getFieldValue(document._source, field);
    if (fieldValue) {
      property[field] = fieldValue;
    }
  });
  return property;
};

const getLayerSource = (data: any, layerConfig: DocumentLayerSpecification) => {
  const geoFieldName = getGeoFieldName(layerConfig);
  const geoFieldType = getGeoFieldType(layerConfig);
  const featureList: any = [];
  data.forEach((item: any) => {
    const geoFieldValue = getFieldValue(item._source, geoFieldName);
    const geometry = buildGeometry(geoFieldType, geoFieldValue);
    if (geometry) {
      const feature = {
        geometry,
        properties: buildProperties(item, layerConfig.source.tooltipFields),
      };
      featureList.push(feature);
    }
  });
  return {
    type: 'FeatureCollection',
    features: featureList,
  };
};

const addNewLayer = (
  layerConfig: DocumentLayerSpecification,
  maplibreRef: MaplibreRef,
  data: any,
  beforeLayerId: string | undefined
) => {
  const maplibreInstance = maplibreRef.current;
  const mbLayerBeforeId = getMaplibreBeforeLayerId(layerConfig, maplibreRef, beforeLayerId);
  const addLineLayer = (
    documentLayerConfig: DocumentLayerSpecification,
    beforeId: string | undefined
  ) => {
    const lineLayerId = buildLayerSuffix(documentLayerConfig.id, 'line');
    maplibreInstance?.addLayer(
      {
        id: lineLayerId,
        type: 'line',
        source: documentLayerConfig.id,
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': documentLayerConfig.style?.fillColor,
          'line-opacity': documentLayerConfig.opacity / 100,
          'line-width': documentLayerConfig.style?.borderThickness,
        },
      },
      beforeId
    );
    maplibreInstance?.setLayoutProperty(lineLayerId, 'visibility', documentLayerConfig.visibility);
  };

  const addCircleLayer = (
    documentLayerConfig: DocumentLayerSpecification,
    beforeId: string | undefined
  ) => {
    const circleLayerId = buildLayerSuffix(documentLayerConfig.id, 'circle');
    maplibreInstance?.addLayer(
      {
        id: circleLayerId,
        type: 'circle',
        source: layerConfig.id,
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': documentLayerConfig.style?.markerSize,
          'circle-color': documentLayerConfig.style?.fillColor,
          'circle-opacity': documentLayerConfig.opacity / 100,
          'circle-stroke-width': documentLayerConfig.style?.borderThickness,
          'circle-stroke-color': documentLayerConfig.style?.borderColor,
        },
      },
      beforeId
    );
    maplibreInstance?.setLayoutProperty(
      circleLayerId,
      'visibility',
      documentLayerConfig.visibility
    );
  };

  const addFillLayer = (
    documentLayerConfig: DocumentLayerSpecification,
    beforeId: string | undefined
  ) => {
    const fillLayerId = buildLayerSuffix(documentLayerConfig.id, 'fill');
    maplibreInstance?.addLayer(
      {
        id: fillLayerId,
        type: 'fill',
        source: layerConfig.id,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': documentLayerConfig.style?.fillColor,
          'fill-opacity': documentLayerConfig.opacity / 100,
        },
      },
      beforeId
    );
    maplibreInstance?.setLayoutProperty(fillLayerId, 'visibility', documentLayerConfig.visibility);
    // Due to limitations on WebGL, fill can't render outlines with width wider than 1,
    // so we have to create another style layer with type=line to apply width.
    const outlineId = buildLayerSuffix(documentLayerConfig.id, 'fill-outline');
    maplibreInstance?.addLayer(
      {
        id: outlineId,
        type: 'line',
        source: layerConfig.id,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': layerConfig.style?.borderColor,
          'line-opacity': layerConfig.opacity / 100,
          'line-width': layerConfig.style?.borderThickness,
        },
      },
      beforeId
    );
    maplibreInstance?.setLayoutProperty(outlineId, 'visibility', layerConfig.visibility);
  };

  if (maplibreInstance) {
    const source = getLayerSource(data, layerConfig);
    maplibreInstance.addSource(layerConfig.id, {
      type: 'geojson',
      data: source,
    });
    addCircleLayer(layerConfig, mbLayerBeforeId);
    const geoFieldType = getGeoFieldType(layerConfig);
    if (geoFieldType === 'geo_shape') {
      addLineLayer(layerConfig, mbLayerBeforeId);
      addFillLayer(layerConfig, mbLayerBeforeId);
    }
  }
};

const updateCircleLayer = (
  maplibreInstance: Maplibre,
  documentLayerConfig: DocumentLayerSpecification
) => {
  const circleLayerId = buildLayerSuffix(documentLayerConfig.id, 'circle');
  const circleLayerStyle = documentLayerConfig.style;
  maplibreInstance?.setLayerZoomRange(
    circleLayerId,
    documentLayerConfig.zoomRange[0],
    documentLayerConfig.zoomRange[1]
  );
  maplibreInstance?.setPaintProperty(
    circleLayerId,
    'circle-opacity',
    documentLayerConfig.opacity / 100
  );
  maplibreInstance?.setPaintProperty(circleLayerId, 'circle-color', circleLayerStyle?.fillColor);
  maplibreInstance?.setPaintProperty(
    circleLayerId,
    'circle-stroke-color',
    circleLayerStyle?.borderColor
  );
  maplibreInstance?.setPaintProperty(
    circleLayerId,
    'circle-stroke-width',
    circleLayerStyle?.borderThickness
  );
  maplibreInstance?.setPaintProperty(circleLayerId, 'circle-radius', circleLayerStyle?.markerSize);
};

const updateLineLayer = (
  maplibreInstance: Maplibre,
  documentLayerConfig: DocumentLayerSpecification
) => {
  const lineLayerId = buildLayerSuffix(documentLayerConfig.id, 'line');
  maplibreInstance?.setLayerZoomRange(
    lineLayerId,
    documentLayerConfig.zoomRange[0],
    documentLayerConfig.zoomRange[1]
  );
  maplibreInstance?.setPaintProperty(
    lineLayerId,
    'line-opacity',
    documentLayerConfig.opacity / 100
  );
  maplibreInstance?.setPaintProperty(
    lineLayerId,
    'line-color',
    documentLayerConfig.style?.fillColor
  );
  maplibreInstance?.setPaintProperty(
    lineLayerId,
    'line-width',
    documentLayerConfig.style?.borderThickness
  );
};

const updateFillLayer = (
  maplibreInstance: Maplibre,
  documentLayerConfig: DocumentLayerSpecification
) => {
  const fillLayerId = buildLayerSuffix(documentLayerConfig.id, 'fill');
  maplibreInstance?.setLayerZoomRange(
    fillLayerId,
    documentLayerConfig.zoomRange[0],
    documentLayerConfig.zoomRange[1]
  );
  maplibreInstance?.setPaintProperty(
    fillLayerId,
    'fill-opacity',
    documentLayerConfig.opacity / 100
  );
  maplibreInstance?.setPaintProperty(
    fillLayerId,
    'fill-color',
    documentLayerConfig.style?.fillColor
  );
  maplibreInstance?.setPaintProperty(
    fillLayerId,
    'fill-outline-color',
    documentLayerConfig.style?.borderColor
  );
  const outlineLayerId = buildLayerSuffix(documentLayerConfig.id, 'fill-outline');
  maplibreInstance?.setPaintProperty(
    outlineLayerId,
    'line-color',
    documentLayerConfig.style?.borderColor
  );
  maplibreInstance?.setPaintProperty(
    outlineLayerId,
    'line-width',
    documentLayerConfig.style?.borderThickness
  );
};

const updateLayerConfig = (
  layerConfig: DocumentLayerSpecification,
  maplibreRef: MaplibreRef,
  data: any
) => {
  const maplibreInstance = maplibreRef.current;
  if (maplibreInstance) {
    const dataSource = maplibreInstance?.getSource(layerConfig.id);
    if (dataSource) {
      // @ts-ignore
      dataSource.setData(getLayerSource(data, layerConfig));
    }
    updateCircleLayer(maplibreInstance, layerConfig);
    const geoFieldType = getGeoFieldType(layerConfig);
    if (geoFieldType === 'geo_shape') {
      updateLineLayer(maplibreInstance, layerConfig);
      updateFillLayer(maplibreInstance, layerConfig);
    }
  }
};

export const DocumentLayerFunctions = {
  render: (
    maplibreRef: MaplibreRef,
    layerConfig: DocumentLayerSpecification,
    data: any,
    beforeLayerId: string | undefined
  ) => {
    if (layerExistInMbSource(layerConfig.id, maplibreRef)) {
      updateLayerConfig(layerConfig, maplibreRef, data);
    } else {
      addNewLayer(layerConfig, maplibreRef, data, beforeLayerId);
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: DocumentLayerSpecification) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((layer: { id: any }) => {
      if (layer.id.includes(layerConfig.id)) {
        maplibreRef.current?.removeLayer(layer.id);
      }
    });
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: DocumentLayerSpecification) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((layer) => {
      if (layer.id.includes(layerConfig.id)) {
        maplibreRef.current?.setLayoutProperty(layer.id, 'visibility', layerConfig.visibility);
      }
    });
  },
};
