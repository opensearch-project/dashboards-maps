/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClusterLayerSpecification } from './mapLayerType';
import { convertGeoPointToGeoJSON } from '../utils/geo_formater';
import { Map as Maplibre } from 'maplibre-gl';
import {
  addCircleLayer,
  hasLayer,
  updateCircleLayer,
  hasSymbolLayer,
  createClusterLayerSymbolSpecification,
  updateSymbolLayer,
  addSymbolLayer,
} from './map/layer_operations';
import { MaplibreRef, getMaplibreAboveLayerId } from './layersFunctions';
import { decodeGeoHash, decodeGeoTile, decodeGeoHex } from '../utils/decode';

const getScaleRadius = (
  value: number,
  maxValue: number,
  zoom: number,
  layerConfig: ClusterLayerSpecification
) => {
  const precisionBiasBase = 4;
  const precisionBiasNumerator = 200;

  const precision = layerConfig.source.cluster.precision;

  const pct = Math.abs(value) / Math.abs(maxValue);
  const zoomRadius = 0.5 * Math.pow(2, zoom);
  const precisionScale = precisionBiasNumerator / Math.pow(precisionBiasBase, precision);

  // square root value percentage
  const radius = Math.pow(pct, 0.5) * zoomRadius * precisionScale;
  return radius;
};

const getCircleColor = () => {};

const getLayerSource = (
  data: any,
  layerConfig: ClusterLayerSpecification,
  maplibreInstance: Maplibre
) => {
  const { useCentroid, agg } = layerConfig.source.cluster;
  const buckets = data[2].buckets;
  const bucketsValueArr = buckets.map((item: any) => item?.[1]?.value ?? item.doc_count);
  const maxBucketValue = Math.max.apply(null, bucketsValueArr);
  const zoom = maplibreInstance.getZoom();
  const featureList: any = [];
  buckets.forEach((item: any) => {
    const { doc_count, key } = item;
    let location;
    const value = item?.[1]?.value;
    if (useCentroid) {
      location = item[3].location;
    } else if (agg === 'geohash_grid') {
      location = decodeGeoHash(key);
    } else if (agg === 'geotile_grid') {
      location = decodeGeoTile(key);
    } else if (agg === 'geohex_grid') {
      location = decodeGeoHex(key);
    }
    const geometry = convertGeoPointToGeoJSON(location);
    if (geometry) {
      //If there is not value, that means the metric agg type is count, use doc_count
      const radius = getScaleRadius(value ?? doc_count, maxBucketValue, zoom, layerConfig);
      let color;
      if (layerConfig.style.fillType === 'gradient') {
        color = getCircleColor();
      }
      const feature = {
        geometry,
        properties: { count: doc_count, value, key, radius, color },
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
  layerConfig: ClusterLayerSpecification,
  maplibreRef: MaplibreRef,
  data: any,
  beforeLayerId: string | undefined
) => {
  const maplibreInstance = maplibreRef.current;
  if (!maplibreInstance) {
    return;
  }
  const source = getLayerSource(data, layerConfig, maplibreInstance);
  maplibreInstance.addSource(layerConfig.id, {
    type: 'geojson',
    data: source,
  });
  addCircleLayer(maplibreInstance, {
    fillColor: layerConfig.style.fillColor,
    maxZoom: layerConfig.zoomRange[1],
    minZoom: layerConfig.zoomRange[0],
    opacity: layerConfig.opacity,
    outlineColor: layerConfig.style.borderColor,
    radius: ['get', 'radius'],
    sourceId: layerConfig.id,
    visibility: layerConfig.visibility,
    width: layerConfig.style.borderThickness,
  });
};

const updateLayer = (
  layerConfig: ClusterLayerSpecification,
  maplibreRef: MaplibreRef,
  data: any
) => {
  const maplibreInstance = maplibreRef.current;
  if (maplibreInstance) {
    const dataSource = maplibreInstance?.getSource(layerConfig.id);
    if (dataSource) {
      // @ts-ignore
      dataSource.setData(getLayerSource(data, layerConfig, maplibreInstance));
    }
    updateCircleLayer(maplibreInstance, {
      fillColor: layerConfig.style.fillColor,
      maxZoom: layerConfig.zoomRange[1],
      minZoom: layerConfig.zoomRange[0],
      opacity: layerConfig.opacity,
      outlineColor: layerConfig.style.borderColor,
      radius: ['get', 'radius'],
      sourceId: layerConfig.id,
      visibility: layerConfig.visibility,
      width: layerConfig.style.borderThickness,
    });
  }
};

const renderMarkerLayer = (
  maplibreRef: MaplibreRef,
  layerConfig: ClusterLayerSpecification,
  data: any,
  beforeLayerId: string | undefined
) => {
  if (hasLayer(maplibreRef.current!, layerConfig.id)) {
    updateLayer(layerConfig, maplibreRef, data);
  } else {
    addNewLayer(layerConfig, maplibreRef, data, beforeLayerId);
  }
};

// The function to render label for document layer
const renderLabelLayer = (layerConfig: ClusterLayerSpecification, maplibreRef: MaplibreRef) => {
  const hasLabelLayer = hasSymbolLayer(maplibreRef.current!, layerConfig.id);
  // If the label set to enabled, add the label layer
  const symbolLayerSpec = createClusterLayerSymbolSpecification(layerConfig);
  if (hasLabelLayer) {
    updateSymbolLayer(maplibreRef.current!, symbolLayerSpec);
  } else {
    const beforeLayerId = getMaplibreAboveLayerId(layerConfig.id, maplibreRef.current!);
    addSymbolLayer(maplibreRef.current!, symbolLayerSpec, beforeLayerId);
  }
};

export const ClusterLayerFunctions = {
  render: (
    maplibreRef: MaplibreRef,
    layerConfig: ClusterLayerSpecification,
    data: any,
    beforeLayerId: string | undefined
  ) => {
    renderMarkerLayer(maplibreRef, layerConfig, data, beforeLayerId);
    renderLabelLayer(layerConfig, maplibreRef);
  },
};
