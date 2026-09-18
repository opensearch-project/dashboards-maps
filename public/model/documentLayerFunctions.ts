/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { parse } from 'wellknown';
import { DocumentLayerSpecification } from './mapLayerType';
import { convertGeoPointToGeoJSON, isGeoJSON } from '../utils/geo_formater';
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
  createDocumentSymbolLayerSpecification,
} from './map/layer_operations';
import { getMaplibreAboveLayerId, MaplibreRef } from './layersFunctions';
import {
  getBuiltInIconById,
  DEFAULT_ICON_ID,
  DEFAULT_ICON_FILL_COLOR,
  DEFAULT_ICON_STROKE_COLOR,
  applyIconColors,
} from '../components/map_icons';

/**
 * Resolve the final colored SVG string for a given layer's icon config.
 * Built-in icons have fill/stroke colors applied via template substitution.
 * Custom icons use the stored inline SVG as-is.
 */
const resolveIconSvg = (layerConfig: DocumentLayerSpecification): string | undefined => {
  const iconConfig = layerConfig.style.iconConfig;
  const iconId = iconConfig?.iconId || DEFAULT_ICON_ID;
  const fillColor = iconConfig?.fillColor || DEFAULT_ICON_FILL_COLOR;
  const strokeColor = iconConfig?.strokeColor || DEFAULT_ICON_STROKE_COLOR;
  const iconStyle = iconConfig?.iconStyle || 'filled';

  const builtIn = getBuiltInIconById(iconId);
  if (builtIn) {
    return applyIconColors(builtIn.svg, fillColor, strokeColor, iconStyle);
  }
  return iconConfig?.svg;
};

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

/**
 * Get the icon layer ID for a given source layer
 */
const getIconLayerId = (sourceId: string) => `${sourceId}-icon`;

/**
 * Check if icon mode is enabled for a layer
 */
const isIconMode = (layerConfig: DocumentLayerSpecification): boolean => {
  return layerConfig.style?.markerType === 'icon';
};

/**
 * Convert an SVG string to a data URL for image loading.
 * data: URLs are allowed by the CSP img-src directive.
 * Security note: The SVG has been validated and sanitized before reaching this point.
 * Additionally, when loaded as an <img> src, the browser treats the SVG as a
 * static image — scripts and external references are not executed in this context.
 */
const svgToDataUrl = (svg: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Load an icon image into the maplibre instance.
 * The SVG is loaded via a data URL into an <img> element. When used as img.src,
 * browsers parse the SVG in a restricted context where scripts don't execute and
 * external resource loading is blocked — this is inherent browser security for
 * images loaded via data URLs.
 */
const loadIconImage = (
  maplibreInstance: any,
  imageId: string,
  svg: string,
  size: number = 24
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If image already exists, resolve immediately
    if (maplibreInstance.hasImage(imageId)) {
      resolve();
      return;
    }

    const img = new Image(size, size);
    img.onload = () => {
      try {
        if (!maplibreInstance.hasImage(imageId)) {
          maplibreInstance.addImage(imageId, img, { sdf: false });
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      reject(new Error(`Failed to load icon image: ${imageId}`));
    };
    img.src = svgToDataUrl(svg);
  });
};

/**
 * Build a unique maplibre image ID that includes color/style so different
 * color variants are stored as separate images in the maplibre image registry.
 */
const buildImageId = (layerConfig: DocumentLayerSpecification): string => {
  const iconConfig = layerConfig.style.iconConfig;
  const iconId = iconConfig?.iconId || DEFAULT_ICON_ID;
  const fillColor = (iconConfig?.fillColor || DEFAULT_ICON_FILL_COLOR).replace('#', '');
  const strokeColor = (iconConfig?.strokeColor || DEFAULT_ICON_STROKE_COLOR).replace('#', '');
  const iconStyle = iconConfig?.iconStyle || 'filled';
  return `map-icon-${iconId}-${iconStyle}-${fillColor}-${strokeColor}`;
};

/**
 * Ensure the icon is loaded in maplibre before adding the layer.
 * If the icon is already loaded, adds the layer immediately.
 */
const ensureIconAndAddLayer = (
  maplibreInstance: any,
  layerConfig: DocumentLayerSpecification
) => {
  const iconConfig = layerConfig.style.iconConfig;
  const iconSvg = resolveIconSvg(layerConfig);
  if (!iconSvg) return;

  const imageId = buildImageId(layerConfig);
  loadIconImage(maplibreInstance, imageId, iconSvg, iconConfig?.iconSize || 24)
    .then(() => {
      addIconLayer(maplibreInstance, layerConfig, imageId);
    })
    .catch(() => {
      // Fallback to circle layer if icon load fails
      addCircleLayer(maplibreInstance, {
        fillColor: layerConfig.style?.fillColor,
        maxZoom: layerConfig.zoomRange[1],
        minZoom: layerConfig.zoomRange[0],
        opacity: layerConfig.opacity,
        outlineColor: layerConfig.style?.borderColor,
        radius: layerConfig.style?.markerSize,
        sourceId: layerConfig.id,
        visibility: layerConfig.visibility,
        width: layerConfig.style?.borderThickness,
      });
    });
};

/**
 * Add an icon (symbol) layer to the map for document point rendering
 */
const addIconLayer = (
  maplibreInstance: any,
  layerConfig: DocumentLayerSpecification,
  imageId: string
) => {
  const iconConfig = layerConfig.style.iconConfig;
  const iconSize = iconConfig?.iconSize || 24;
  const iconLayerId = getIconLayerId(layerConfig.id);

  // Don't add if layer already exists
  if (maplibreInstance.getLayer(iconLayerId)) {
    return;
  }

  const layerSpec: any = {
    id: iconLayerId,
    type: 'symbol',
    source: layerConfig.id,
    filter: ['==', '$type', 'Point'],
    layout: {
      'icon-image': imageId,
      'icon-size': iconSize / 24, // normalize to base size
      'icon-allow-overlap': true,
      'icon-ignore-placement': false,
      visibility: layerConfig.visibility,
    },
    paint: {
      'icon-opacity': layerConfig.opacity / 100,
    },
  };

  maplibreInstance.addLayer(layerSpec);
  maplibreInstance.setLayerZoomRange(iconLayerId, layerConfig.zoomRange[0], layerConfig.zoomRange[1]);
};

/**
 * Update an existing icon layer
 */
const updateIconLayer = (
  maplibreInstance: any,
  layerConfig: DocumentLayerSpecification,
  imageId: string
) => {
  const iconConfig = layerConfig.style.iconConfig;
  const iconSize = iconConfig?.iconSize || 24;
  const iconLayerId = getIconLayerId(layerConfig.id);

  maplibreInstance.setLayoutProperty(iconLayerId, 'icon-image', imageId);
  maplibreInstance.setLayoutProperty(iconLayerId, 'icon-size', iconSize / 24);
  maplibreInstance.setLayoutProperty(iconLayerId, 'visibility', layerConfig.visibility);
  maplibreInstance.setPaintProperty(iconLayerId, 'icon-opacity', layerConfig.opacity / 100);
  maplibreInstance.setLayerZoomRange(iconLayerId, layerConfig.zoomRange[0], layerConfig.zoomRange[1]);
};

/**
 * Check if an icon layer exists
 */
const hasIconLayer = (maplibreInstance: any, sourceId: string): boolean => {
  return !!maplibreInstance.getLayer(getIconLayerId(sourceId));
};

/**
 * Remove an icon layer
 */
const removeIconLayer = (maplibreInstance: any, sourceId: string) => {
  const iconLayerId = getIconLayerId(sourceId);
  if (maplibreInstance.getLayer(iconLayerId)) {
    maplibreInstance.removeLayer(iconLayerId);
  }
};

/**
 * Check if a circle layer exists for the given source
 */
const hasCircleLayer = (maplibreInstance: any, sourceId: string): boolean => {
  return !!maplibreInstance.getLayer(`${sourceId}-circle`);
};

/**
 * Remove circle layer
 */
const removeCircleLayer = (maplibreInstance: any, sourceId: string) => {
  const circleLayerId = `${sourceId}-circle`;
  if (maplibreInstance.getLayer(circleLayerId)) {
    maplibreInstance.removeLayer(circleLayerId);
  }
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
  const source = getLayerSource(data, layerConfig);

  // Guard: source may already exist if render is called while async icon loading is in progress
  if (!maplibreInstance.getSource(layerConfig.id)) {
    maplibreInstance.addSource(layerConfig.id, {
      type: 'geojson',
      data: source,
    });
  } else {
    // Update existing source data
    const existingSource = maplibreInstance.getSource(layerConfig.id);
    if (existingSource) {
      // @ts-ignore
      existingSource.setData(source);
    }
  }

  if (isIconMode(layerConfig)) {
    // Load icon and add symbol layer
    ensureIconAndAddLayer(maplibreInstance, layerConfig);
  } else {
    addCircleLayer(maplibreInstance, {
      fillColor: layerConfig.style?.fillColor,
      maxZoom: layerConfig.zoomRange[1],
      minZoom: layerConfig.zoomRange[0],
      opacity: layerConfig.opacity,
      outlineColor: layerConfig.style?.borderColor,
      radius: layerConfig.style?.markerSize,
      sourceId: layerConfig.id,
      visibility: layerConfig.visibility,
      width: layerConfig.style?.borderThickness,
    });
  }

  const geoFieldType = getGeoFieldType(layerConfig);
  if (geoFieldType === 'geo_shape') {
    addLineLayer(maplibreInstance, {
      width: layerConfig.style?.borderThickness,
      color: layerConfig.style?.fillColor,
      maxZoom: layerConfig.zoomRange[1],
      minZoom: layerConfig.zoomRange[0],
      opacity: layerConfig.opacity,
      sourceId: layerConfig.id,
      visibility: layerConfig.visibility,
    });
    addPolygonLayer(maplibreInstance, {
      width: layerConfig.style?.borderThickness,
      fillColor: layerConfig.style?.fillColor,
      maxZoom: layerConfig.zoomRange[1],
      minZoom: layerConfig.zoomRange[0],
      opacity: layerConfig.opacity,
      sourceId: layerConfig.id,
      outlineColor: layerConfig.style?.borderColor,
      visibility: layerConfig.visibility,
    });
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

    if (isIconMode(layerConfig)) {
      // Remove circle layer if it exists (switching from marker to icon mode)
      if (hasCircleLayer(maplibreInstance, layerConfig.id)) {
        removeCircleLayer(maplibreInstance, layerConfig.id);
      }

      const iconConfig = layerConfig.style.iconConfig;
      const iconSvg = resolveIconSvg(layerConfig);
      const imageId = buildImageId(layerConfig);

      if (iconSvg) {
        loadIconImage(maplibreInstance, imageId, iconSvg, iconConfig?.iconSize || 24)
          .then(() => {
            if (hasIconLayer(maplibreInstance, layerConfig.id)) {
              updateIconLayer(maplibreInstance, layerConfig, imageId);
            } else {
              addIconLayer(maplibreInstance, layerConfig, imageId);
            }
          })
          .catch(() => {
            // Fallback: icon load failed, re-add circle layer
            addCircleLayer(maplibreInstance, {
              fillColor: layerConfig.style?.fillColor,
              maxZoom: layerConfig.zoomRange[1],
              minZoom: layerConfig.zoomRange[0],
              opacity: layerConfig.opacity,
              outlineColor: layerConfig.style?.borderColor,
              radius: layerConfig.style?.markerSize,
              sourceId: layerConfig.id,
              visibility: layerConfig.visibility,
              width: layerConfig.style?.borderThickness,
            });
          });
      }
    } else {
      // Remove icon layer if switching back to marker mode
      if (hasIconLayer(maplibreInstance, layerConfig.id)) {
        removeIconLayer(maplibreInstance, layerConfig.id);
      }

      if (hasCircleLayer(maplibreInstance, layerConfig.id)) {
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
      } else {
        addCircleLayer(maplibreInstance, {
          fillColor: layerConfig.style?.fillColor,
          maxZoom: layerConfig.zoomRange[1],
          minZoom: layerConfig.zoomRange[0],
          opacity: layerConfig.opacity,
          outlineColor: layerConfig.style?.borderColor,
          radius: layerConfig.style?.markerSize,
          sourceId: layerConfig.id,
          visibility: layerConfig.visibility,
          width: layerConfig.style?.borderThickness,
        });
      }
    }

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
const renderLabelLayer = (layerConfig: DocumentLayerSpecification, maplibreRef: MaplibreRef) => {
  const hasLabelLayer = hasSymbolLayer(maplibreRef.current!, layerConfig.id);
  // If the label set to enabled, add the label layer
  if (layerConfig.style?.label?.enabled) {
    const symbolLayerSpec = createDocumentSymbolLayerSpecification(layerConfig);
    if (hasLabelLayer) {
      updateSymbolLayer(maplibreRef.current!, symbolLayerSpec);
    } else {
      const beforeLayerId = getMaplibreAboveLayerId(layerConfig.id, maplibreRef.current!);
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
    renderLabelLayer(layerConfig, maplibreRef);
  },
};
