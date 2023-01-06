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

const GeoJSONMaplibreMap = new Map<string, string>([
  ['Point', 'circle'],
  ['LineString', 'line'],
  ['Polygon', 'fill'],
]);

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
  const addGeoPointLayer = () => {
    maplibreInstance?.addLayer(
      {
        id: layerConfig.id,
        type: 'circle',
        source: layerConfig.id,
        paint: {
          'circle-radius': layerConfig.style?.markerSize,
          'circle-color': layerConfig.style?.fillColor,
          'circle-opacity': layerConfig.opacity / 100,
          'circle-stroke-width': layerConfig.style?.borderThickness,
          'circle-stroke-color': layerConfig.style?.borderColor,
        },
      },
      mbLayerBeforeId
    );
    maplibreInstance?.setLayoutProperty(layerConfig.id, 'visibility', layerConfig.visibility);
  };

  const addGeoShapeLayer = (source: any) => {
    source.features.map((feature: any, index: number) => {
      const mbType = GeoJSONMaplibreMap.get(feature.geometry.type);
      const mbLayerId = `${layerConfig.id}-${index}`;
      if (mbType === 'circle') {
        maplibreInstance?.addLayer(
          {
            id: mbLayerId,
            type: 'circle',
            source: layerConfig.id,
            filter: ['==', '$type', 'Point'],
            paint: {
              'circle-radius': layerConfig.style?.markerSize,
              'circle-color': layerConfig.style?.fillColor,
              'circle-opacity': layerConfig.opacity / 100,
              'circle-stroke-width': layerConfig.style?.borderThickness,
              'circle-stroke-color': layerConfig.style?.borderColor,
            },
          },
          mbLayerBeforeId
        );
        maplibreInstance?.setLayoutProperty(mbLayerId, 'visibility', layerConfig.visibility);
      } else if (mbType === 'line') {
        maplibreInstance?.addLayer(
          {
            id: mbLayerId,
            type: 'line',
            source: layerConfig.id,
            filter: ['==', '$type', 'LineString'],
            paint: {
              'line-color': layerConfig.style?.fillColor,
              'line-opacity': layerConfig.opacity / 100,
              'line-width': layerConfig.style?.borderThickness,
            },
          },
          mbLayerBeforeId
        );
        maplibreInstance?.setLayoutProperty(mbLayerId, 'visibility', layerConfig.visibility);
      } else if (mbType === 'fill') {
        const polygonBorderLayerId = `${mbLayerId}-border`;
        maplibreInstance?.addLayer(
          {
            id: mbLayerId,
            type: 'fill',
            source: layerConfig.id,
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'fill-color': layerConfig.style?.fillColor,
              'fill-opacity': layerConfig.opacity / 100,
              'fill-outline-color': layerConfig.style?.borderColor,
            },
          },
          mbLayerBeforeId
        );
        maplibreInstance?.setLayoutProperty(mbLayerId, 'visibility', layerConfig.visibility);
        // Add boarder for polygon
        maplibreInstance?.addLayer(
          {
            id: polygonBorderLayerId,
            type: 'line',
            source: layerConfig.id,
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'line-color': layerConfig.style?.borderColor,
              'line-opacity': layerConfig.opacity / 100,
              'line-width': layerConfig.style?.borderThickness,
            },
          },
          mbLayerBeforeId
        );
        maplibreInstance?.setLayoutProperty(
          polygonBorderLayerId,
          'visibility',
          layerConfig.visibility
        );
      }
    });
  };
  if (maplibreInstance) {
    const source = getLayerSource(data, layerConfig);
    maplibreInstance.addSource(layerConfig.id, {
      type: 'geojson',
      data: source,
    });
    const geoFieldType = getGeoFieldType(layerConfig);
    if (geoFieldType === 'geo_point') {
      addGeoPointLayer();
    } else {
      addGeoShapeLayer(source);
    }
  }
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
    const geoFieldType = getGeoFieldType(layerConfig);
    if (geoFieldType === 'geo_point') {
      maplibreInstance?.setLayerZoomRange(
        layerConfig.id,
        layerConfig.zoomRange[0],
        layerConfig.zoomRange[1]
      );
      maplibreInstance?.setPaintProperty(
        layerConfig.id,
        'circle-opacity',
        layerConfig.opacity / 100
      );
      maplibreInstance?.setPaintProperty(
        layerConfig.id,
        'circle-color',
        layerConfig.style?.fillColor
      );
      maplibreInstance?.setPaintProperty(
        layerConfig.id,
        'circle-stroke-color',
        layerConfig.style?.borderColor
      );
      maplibreInstance?.setPaintProperty(
        layerConfig.id,
        'circle-stroke-width',
        layerConfig.style?.borderThickness
      );
      maplibreInstance?.setPaintProperty(
        layerConfig.id,
        'circle-radius',
        layerConfig.style?.markerSize
      );
    } else {
      getCurrentStyleLayers(maplibreRef).forEach((layer) => {
        if (layer.id.includes(layerConfig.id)) {
          maplibreInstance.setLayerZoomRange(
            layer.id,
            layerConfig.zoomRange[0],
            layerConfig.zoomRange[1]
          );
          if (layer.type === 'circle') {
            maplibreInstance?.setPaintProperty(
              layer.id,
              'circle-opacity',
              layerConfig.opacity / 100
            );
            maplibreInstance?.setPaintProperty(
              layer.id,
              'circle-color',
              layerConfig.style?.fillColor
            );
            maplibreInstance?.setPaintProperty(
              layer.id,
              'circle-stroke-color',
              layerConfig.style?.borderColor
            );
            maplibreInstance?.setPaintProperty(
              layer.id,
              'circle-stroke-width',
              layerConfig.style?.borderThickness
            );
            maplibreInstance?.setPaintProperty(
              layer.id,
              'circle-radius',
              layerConfig.style?.markerSize
            );
          } else if (layer.type === 'line') {
            if (layer.id.includes('border')) {
              maplibreInstance?.setPaintProperty(
                layer.id,
                'line-color',
                layerConfig.style?.borderColor
              );
              maplibreInstance?.setPaintProperty(
                layer.id,
                'line-width',
                layerConfig.style?.borderThickness
              );
            } else {
              maplibreInstance?.setPaintProperty(
                layer.id,
                'line-opacity',
                layerConfig.opacity / 100
              );
              maplibreInstance?.setPaintProperty(
                layer.id,
                'line-color',
                layerConfig.style?.fillColor
              );
              maplibreInstance?.setPaintProperty(
                layer.id,
                'line-width',
                layerConfig.style?.borderThickness
              );
            }
          } else if (layer.type === 'fill') {
            maplibreInstance?.setPaintProperty(layer.id, 'fill-opacity', layerConfig.opacity / 100);
            maplibreInstance?.setPaintProperty(
              layer.id,
              'fill-color',
              layerConfig.style?.fillColor
            );
            maplibreInstance?.setPaintProperty(
              layer.id,
              'fill-outline-color',
              layerConfig.style?.borderColor
            );
          }
        }
      });
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
