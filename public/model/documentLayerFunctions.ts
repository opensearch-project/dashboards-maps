/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { parse } from 'wellknown';
import { DocumentLayerSpecification } from './mapLayerType';
import { convertGeoPointToGeoJSON, isGeoJSON } from '../utils/geo_formater';
import { getMaplibreBeforeLayerId } from './layersFunctions';
import {
  addCircleLayer,
  addLineLayer,
  addPolygonLayer,
  addSymbolLayer,
  hasLayer,
  hasSymbolLayer,
  updateCircleLayer,
  updateLineLayer,
  updatePolygonLayer,
  updateSymbolLayer,
  removeSymbolLayer,
  createSymbolLayerSpecification,
} from './map/layer_operations';

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

const getFieldValue = (data: any, name: string) => {
  if (!name) {
    return undefined;
  }
  const keys = name.split('.');
  return keys.reduce((pre, cur) => {
    return pre?.[cur];
  }, data);
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
    const fieldValue: string | undefined = getFieldValue(document._source, field);
    if (fieldValue !== undefined) {
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
    const fields: string[] = [];
    if (layerConfig.source.tooltipFields) {
      fields.push(...layerConfig.source.tooltipFields);
    }
    if (layerConfig.style.label?.textByField) {
      fields.push(layerConfig.style.label.textByField);
    }
    if (geometry) {
      const feature = {
        geometry,
        properties: buildProperties(item, fields),
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
  if (!maplibreInstance) {
    return;
  }
  const mbLayerBeforeId = getMaplibreBeforeLayerId(layerConfig, maplibreRef, beforeLayerId);
  const source = getLayerSource(data, layerConfig);
  maplibreInstance.addSource(layerConfig.id, {
    type: 'geojson',
    data: source,
  });
  addCircleLayer(
    maplibreInstance,
    {
      fillColor: layerConfig.style?.fillColor,
      maxZoom: layerConfig.zoomRange[1],
      minZoom: layerConfig.zoomRange[0],
      opacity: layerConfig.opacity,
      outlineColor: layerConfig.style?.borderColor,
      radius: layerConfig.style?.markerSize,
      sourceId: layerConfig.id,
      visibility: layerConfig.visibility,
      width: layerConfig.style?.borderThickness,
    },
    mbLayerBeforeId
  );
  const geoFieldType = getGeoFieldType(layerConfig);
  if (geoFieldType === 'geo_shape') {
    addLineLayer(
      maplibreInstance,
      {
        width: layerConfig.style?.borderThickness,
        color: layerConfig.style?.fillColor,
        maxZoom: layerConfig.zoomRange[1],
        minZoom: layerConfig.zoomRange[0],
        opacity: layerConfig.opacity,
        sourceId: layerConfig.id,
        visibility: layerConfig.visibility,
      },
      mbLayerBeforeId
    );
    addPolygonLayer(
      maplibreInstance,
      {
        width: layerConfig.style?.borderThickness,
        fillColor: layerConfig.style?.fillColor,
        maxZoom: layerConfig.zoomRange[1],
        minZoom: layerConfig.zoomRange[0],
        opacity: layerConfig.opacity,
        sourceId: layerConfig.id,
        outlineColor: layerConfig.style?.borderColor,
        visibility: layerConfig.visibility,
      },
      mbLayerBeforeId
    );
  }
};

const updateLayer = (
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
    updateCircleLayer(maplibreInstance, {
      fillColor: layerConfig.style.fillColor,
      maxZoom: layerConfig.zoomRange[1],
      minZoom: layerConfig.zoomRange[0],
      opacity: layerConfig.opacity,
      outlineColor: layerConfig.style.borderColor,
      radius: layerConfig.style?.markerSize,
      sourceId: layerConfig.id,
      visibility: layerConfig.visibility,
      width: layerConfig.style.borderThickness,
    });
    const geoFieldType = getGeoFieldType(layerConfig);
    if (geoFieldType === 'geo_shape') {
      updateLineLayer(maplibreInstance, {
        width: layerConfig.style.borderThickness,
        color: layerConfig.style.fillColor,
        maxZoom: layerConfig.zoomRange[1],
        minZoom: layerConfig.zoomRange[0],
        opacity: layerConfig.opacity,
        sourceId: layerConfig.id,
        visibility: layerConfig.visibility,
      });
      updatePolygonLayer(maplibreInstance, {
        width: layerConfig.style.borderThickness,
        fillColor: layerConfig.style.fillColor,
        maxZoom: layerConfig.zoomRange[1],
        minZoom: layerConfig.zoomRange[0],
        opacity: layerConfig.opacity,
        sourceId: layerConfig.id,
        outlineColor: layerConfig.style.borderColor,
        visibility: layerConfig.visibility,
      });
    }
  }
};

// The function to render label for document layer
const renderLabelLayer = (
  layerConfig: DocumentLayerSpecification,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
) => {
  const hasLabelLayer = hasSymbolLayer(maplibreRef.current!, layerConfig.id);
  // If the label set to enabled, add the label layer
  if (layerConfig.style?.label?.enabled) {
    const symbolLayerSpec = createSymbolLayerSpecification(layerConfig);
    if (hasLabelLayer) {
      updateSymbolLayer(maplibreRef.current!, symbolLayerSpec);
    } else {
      addSymbolLayer(maplibreRef.current!, symbolLayerSpec, beforeLayerId);
    }
  } else {
    // If the label set to disabled, remove the label layer if it exists
    if (hasLabelLayer) {
      removeSymbolLayer(maplibreRef.current!, layerConfig.id);
    }
  }
};

// The function to render point, line and shape layer for document layer
const renderMarkerLayer = (
  maplibreRef: MaplibreRef,
  layerConfig: DocumentLayerSpecification,
  data: any,
  beforeLayerId: string | undefined
) => {
  if (hasLayer(maplibreRef.current!, layerConfig.id)) {
    updateLayer(layerConfig, maplibreRef, data);
  } else {
    addNewLayer(layerConfig, maplibreRef, data, beforeLayerId);
  }
};

export const DocumentLayerFunctions = {
  render: (
    maplibreRef: MaplibreRef,
    layerConfig: DocumentLayerSpecification,
    data: any,
    beforeLayerId: string | undefined
  ) => {
    renderMarkerLayer(maplibreRef, layerConfig, data, beforeLayerId);
    renderLabelLayer(layerConfig, maplibreRef, beforeLayerId);
  },
};
