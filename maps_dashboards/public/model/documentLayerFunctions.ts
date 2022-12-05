/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { DocumentLayerSpecification } from './mapLayerType';

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

const getLayerSource = (data: any, layerConfig: DocumentLayerSpecification) => {
  const sourceConfig = layerConfig?.source;
  const geoField = sourceConfig.geoFieldName;
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

const addNewLayer = (
  layerConfig: DocumentLayerSpecification,
  maplibreRef: MaplibreRef,
  data: any
) => {
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
        'circle-color': layerConfig.style.fillColor,
        'circle-opacity': layerConfig.opacity / 100,
        'circle-stroke-color': layerConfig.style?.borderColor,
        'circle-stroke-width': layerConfig.style?.borderThickness,
      },
    });
  }
};

const updateLayerConfig = (
  layerConfig: DocumentLayerSpecification,
  maplibreRef: MaplibreRef,
  data: any
) => {
  if (maplibreRef.current) {
    const dataSource = maplibreRef.current?.getSource(layerConfig.id);
    if (dataSource) {
      // @ts-ignore
      dataSource.setData(getLayerSource(data, layerConfig));
    }
    maplibreRef.current?.setLayerZoomRange(
      layerConfig.id,
      layerConfig.zoomRange[0],
      layerConfig.zoomRange[1]
    );
    maplibreRef.current?.setPaintProperty(
      layerConfig.id,
      'circle-opacity',
      layerConfig.opacity / 100
    );
    maplibreRef.current?.setPaintProperty(
      layerConfig.id,
      'circle-color',
      layerConfig.style?.fillColor
    );
    maplibreRef.current?.setPaintProperty(
      layerConfig.id,
      'circle-stroke-color',
      layerConfig.style?.borderColor
    );
    maplibreRef.current?.setPaintProperty(
      layerConfig.id,
      'circle-stroke-width',
      layerConfig.style?.borderThickness
    );
  }
};

export const DocumentLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: DocumentLayerSpecification, data: any) => {
    if (layerExistInMbSource(layerConfig.id, maplibreRef)) {
      updateLayerConfig(layerConfig, maplibreRef, data);
    } else {
      addNewLayer(layerConfig, maplibreRef, data);
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: DocumentLayerSpecification) => {
    if (maplibreRef.current) {
      maplibreRef.current?.removeLayer(layerConfig.id);
    }
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: DocumentLayerSpecification) => {
    if (maplibreRef.current) {
      maplibreRef.current.setLayoutProperty(layerConfig.id, 'visibility', layerConfig.visibility);
    }
  },
};
