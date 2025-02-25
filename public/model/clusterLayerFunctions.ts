/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClusterLayerSpecification } from './mapLayerType';
import { convertGeoPointToGeoJSON } from '../utils/geo_formater';
import { Map as Maplibre } from 'maplibre-gl';
import {
  addCircleLayer,
  addSymbolLayer,
  createClusterLayerSymbolSpecification,
  hasLayer,
  hasSymbolLayer,
  updateCircleLayer,
  updateSymbolLayer,
} from './map/layer_operations';
import { getMaplibreAboveLayerId, MaplibreRef } from './layersFunctions';
import { decodeGeoHash, decodeGeoHex, decodeGeoTile, latLngToBoundsToRadius, metersToPixel } from '../utils/decode';
import { MetricAggregations, Palettes } from '../components/layer_config/cluster_config/config';
import d3 from 'd3';
import { getFormatService } from '../services';
import { LegendOption, MapsLegendHandle } from '../components/map_container/legend';
import { cellToBoundary, greatCircleDistance, UNITS } from 'h3-js';

const getLayerSource = (
  data: any,
  layerConfig: ClusterLayerSpecification,
  maplibreInstance: Maplibre,
  legendRef?: React.RefObject<MapsLegendHandle>
) => {
  const { useCentroid, agg } = layerConfig.source.cluster;
  const buckets = data[2].buckets;
  //If there is no value, that means the metric agg type is count, use doc_count
  const bucketsValueArr = buckets.map((item: any) => item?.[1]?.value ?? item.doc_count);
  const maxBucketValue = Math.max.apply(null, bucketsValueArr);
  const minBucketValue = Math.min.apply(null, bucketsValueArr);
  const zoom = maplibreInstance.getZoom();
  const legendColors = getLegendColors(layerConfig.style.palette);
  const quantizeDomain =
    minBucketValue !== maxBucketValue
      ? [minBucketValue, maxBucketValue]
      : d3.scale.quantize().domain();
  const legendQuantizer = d3.scale.quantize().domain(quantizeDomain).range(legendColors);
  //Only if fillType is gradient and length of response bucket more than 0.
  if (layerConfig.style.fillType === 'gradient' && legendRef?.current) {
    const legendOption = buildLegendOption(layerConfig, legendColors, legendQuantizer);
    legendRef.current.updateLegends(legendOption, buckets.length === 0);
  }

  const featureList: any = [];
  buckets.forEach((item: any) => {
    const { doc_count, key } = item;
    let location;
    //If there is no value, that means the metric agg type is count, use doc_count
    const value = item?.[1]?.value ?? doc_count;
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
      const radius = getScaleRadius(
        value,
        maxBucketValue,
        zoom,
        layerConfig,
        maplibreInstance,
        key
      );

      let color;
      if (layerConfig.style.fillType === 'gradient') {
        color = getCircleColor(legendQuantizer, value);
      } else {
        color = layerConfig.style.fillColor;
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
  legendRef?: React.RefObject<MapsLegendHandle>
) => {
  const maplibreInstance = maplibreRef.current;
  if (!maplibreInstance) {
    return;
  }
  const source = getLayerSource(data, layerConfig, maplibreInstance, legendRef);
  maplibreInstance.addSource(layerConfig.id, {
    type: 'geojson',
    data: source,
  });
  addCircleLayer(maplibreInstance, {
    fillColor: ['get', 'color'],
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
  data: any,
  legendRef?: React.RefObject<MapsLegendHandle>
) => {
  const maplibreInstance = maplibreRef.current;
  if (maplibreInstance) {
    const dataSource = maplibreInstance?.getSource(layerConfig.id);
    if (dataSource) {
      // @ts-ignore
      dataSource.setData(getLayerSource(data, layerConfig, maplibreInstance, legendRef));
    }
    updateCircleLayer(maplibreInstance, {
      fillColor: ['get', 'color'],
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
  legendRef?: React.RefObject<MapsLegendHandle>
) => {
  if (hasLayer(maplibreRef.current!, layerConfig.id)) {
    updateLayer(layerConfig, maplibreRef, data, legendRef);
  } else {
    addNewLayer(layerConfig, maplibreRef, data, legendRef);
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
    legendRef?: React.RefObject<MapsLegendHandle>
  ) => {
    renderMarkerLayer(maplibreRef, layerConfig, data, legendRef);
    renderLabelLayer(layerConfig, maplibreRef);
  },
};

const getLegendColors = (paletteValue: string) => {
  const palette = Palettes.find((palette) => palette.value === paletteValue);
  //Get color from stop 25 to stop 100.
  const legendColors = palette!.palette?.slice(1).map((item) => item.color);
  return legendColors;
};

const getCircleColor = (legendQuantizer: d3.scale.Quantize<unknown>, value: number) => {
  const color = legendQuantizer(value);
  return color;
};

const buildLegendOption = (
  layerConfig: ClusterLayerSpecification,
  legendColors: string[],
  legendQuantizer: d3.scale.Quantize<unknown>
): LegendOption => {
  const { agg, fieldType, custom_label, field } = layerConfig.source.metric;
  const aggLabel = MetricAggregations.find((item) => item.value === agg)!.label;
  let title;
  if (custom_label) {
    title = custom_label;
  } else if (agg === 'count') {
    title = 'Count';
  } else {
    title = `${aggLabel} ${field}`;
  }

  let format;
  if (agg === 'count') {
    format = { id: 'number' };
  } else {
    //number or date
    format = { id: fieldType };
  }
  const metricFormat = getFormatService().deserialize(format);
  const valueFormatter = metricFormat.getConverterFor('text');
  const list = legendColors.map((color) => {
    const labelText = legendQuantizer.invertExtent(color).map(valueFormatter).join(' – ');
    return {
      label: labelText,
      color,
    };
  });
  return {
    id: layerConfig.id,
    title,
    list,
  };
};

const getScaleRadius = (
  value: number,
  maxValue: number,
  zoom: number,
  layerConfig: ClusterLayerSpecification,
  maplibreInstance: Maplibre,
  key: string
) => {
  // Define min and max radius constraints (in pixels)
  const MIN_RADIUS = 5;
  const MAX_RADIUS = 50;
  
  const { agg } = layerConfig.source.cluster;
  let calculatedRadius;
  let baseRadius;
  
  // Calculate the value scaling factor (using square root for better visual scaling)
  const valueFactor = maxValue === 0 ? 1 : Math.pow(Math.abs(value) / Math.abs(maxValue), 0.5);
  
  if (agg === 'geohash_grid') {
    const precisionBiasBase = 4;
    const precisionBiasNumerator = 200;
    const precision = layerConfig.source.cluster.precision;
    
    const zoomRadius = 0.5 * Math.pow(2, zoom);
    const precisionScale = precisionBiasNumerator / Math.pow(precisionBiasBase, precision);
    
    baseRadius = zoomRadius * precisionScale;
    calculatedRadius = baseRadius * valueFactor;
  } else if (agg === 'geotile_grid') {
    // Get canvas dimensions more efficiently
    const canvas = maplibreInstance.getCanvas();
    const widthNum = canvas.width;
    const heightNum = canvas.height;
    
    const { lat, lon, z } = decodeGeoTile(key);
    baseRadius = latLngToBoundsToRadius(lat, lon, Number(z), widthNum, heightNum) * Math.pow(2, zoom - 1);
    calculatedRadius = baseRadius * valueFactor;
  } else {
    const boundary = cellToBoundary(key, false);
    const center = decodeGeoHex(key);
    const distance = greatCircleDistance([center.lat, center.lon], boundary[0], UNITS.m);
    baseRadius = metersToPixel(maplibreInstance.getZoom(), distance) * 4;
    calculatedRadius = baseRadius * valueFactor;
  }
  
  // Apply min/max constraints
  return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, calculatedRadius));
};
