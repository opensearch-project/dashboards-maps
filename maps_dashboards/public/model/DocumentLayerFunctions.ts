/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { ILayerConfig } from './ILayerConfig';

interface MaplibreRef {
  current: Maplibre | null;
}

const layerExistInMbSource = (layerId: string, maplibreRef: MaplibreRef) => {
  return !!maplibreRef.current?.getLayer(layerId);
};

const getLocationValue = (data: any, geoField: string) => {
  const keys = geoField.split('.');
  return keys.reduce((pre, cur) => {
    return pre?.[cur];
  }, data);
};

const getLayerSource = (data: any, layerConfig: ILayerConfig) => {
  const geoField = layerConfig.source.geoField;
  const featureList: any = [];
  data.forEach((item: any) => {
    const location = getLocationValue(item._source, geoField);
    const feature = {
      geometry: {
        type: 'Point',
        coordinates: [location.lon, location.lat],
      },
      properties: {
        title: item._id,
        description: item._index,
      },
    };
    featureList.push(feature);
  });

  const geoJsonData = {
    type: 'FeatureCollection',
    features: featureList,
  };
  return geoJsonData;
};

const addNewLayer = (layerConfig: ILayerConfig, maplibreRef: MaplibreRef, data: any) => {
  if (maplibreRef.current) {
    const source = getLayerSource(data, layerConfig);
    maplibreRef.current.addSource(layerConfig.id, {
      type: 'geojson',
      data: source,
    });
    maplibreRef.current.addLayer({
      id: layerConfig.id,
      source: layerConfig.id,
      type: 'circle',
      minzoom: layerConfig.zoomRange[0],
      maxzoom: layerConfig.zoomRange[1],
      layout: {
        visibility: layerConfig.visibility === 'visible' ? 'visible' : 'none',
      },
      paint: {
        'circle-radius': 6,
        'circle-color': layerConfig.style?.circleColor,
        'circle-opacity': layerConfig.opacity,
      },
    });
  }
};

const updateLayerConfig = (layerConfig: ILayerConfig, maplibreRef: MaplibreRef) => {
  if (maplibreRef.current) {
    maplibreRef.current?.setLayerZoomRange(
      layerConfig.id,
      layerConfig.zoomRange[0],
      layerConfig.zoomRange[1]
    );
    maplibreRef.current?.setPaintProperty(layerConfig.id, 'circle-opacity', layerConfig.opacity);
  }
};

export const DocumentLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig, data: any) => {
    if (layerExistInMbSource(layerConfig.id, maplibreRef)) {
      updateLayerConfig(layerConfig, maplibreRef);
    } else {
      addNewLayer(layerConfig, maplibreRef, data);
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    if (maplibreRef.current) {
      maplibreRef.current?.removeLayer(layerConfig.id);
    }
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    if (maplibreRef.current) {
      maplibreRef.current.setLayoutProperty(layerConfig.id, 'visibility', layerConfig.visibility);
    }
  },
};
