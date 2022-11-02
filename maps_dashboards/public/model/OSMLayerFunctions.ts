import { Map as Maplibre, LayerSpecification } from 'maplibre-gl';
import { ILayerConfig } from './ILayerConfig';
import { MAP_VECTOR_TILE_BASIC_STYLE } from '../../common';

interface MaplibreRef {
  current: Maplibre | null;
}

// Fetch style layers from OpenSearch vector tile service
const fetchStyleLayers = () => {
  return fetch(MAP_VECTOR_TILE_BASIC_STYLE)
    .then((res) => res.json())
    .then((json) => json.layers)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
    });
};

const getCurrentStyleLayers = (maplibreRef: MaplibreRef) => {
  return maplibreRef.current?.getStyle().layers || [];
};

const handleStyleLayers = (layerConfig: ILayerConfig, maplibreRef: MaplibreRef) => {
  const layers = getCurrentStyleLayers(maplibreRef);
  layers.forEach((mbLayer) => {
    if (mbLayer.id.includes(layerConfig.id)) {
      maplibreRef.current?.setLayerZoomRange(
        mbLayer.id,
        layerConfig.zoomRange[0],
        layerConfig.zoomRange[1]
      );
      // TODO: figure out error reason
      if (mbLayer.type === 'symbol') {
        return;
      }
      maplibreRef.current?.setPaintProperty(
        mbLayer.id,
        `${mbLayer.type}-opacity`,
        layerConfig.opacity
      );
    }
  });
};

const layerExistInMbSource = (layerConfig: ILayerConfig, maplibreRef: MaplibreRef) => {
  const layers = getCurrentStyleLayers(maplibreRef);
  for (const layer in layers) {
    if (layers[layer].id.includes(layerConfig.id)) {
      return true;
    }
  }
  return false;
};

const updateLayerConfig = (layerConfig: ILayerConfig, maplibreRef: MaplibreRef) => {
  if (maplibreRef.current) {
    handleStyleLayers(layerConfig, maplibreRef);
  }
};

const addNewLayer = (layerConfig: ILayerConfig, maplibreRef: MaplibreRef) => {
  if (maplibreRef.current) {
    fetchStyleLayers().then((styleLayers: LayerSpecification[]) => {
      styleLayers.forEach((styleLayer) => {
        styleLayer.id = styleLayer.id + '_' + layerConfig.id;
        maplibreRef.current?.addLayer(styleLayer);
        maplibreRef.current?.setLayoutProperty(styleLayer.id, 'visibility', layerConfig.visibility);
        maplibreRef.current?.setLayerZoomRange(
          styleLayer.id,
          layerConfig.zoomRange[0],
          layerConfig.zoomRange[1]
        );
        // TODO: figure out error reason
        if (styleLayer.type === 'symbol') {
          return;
        }
        maplibreRef.current?.setPaintProperty(
          styleLayer.id,
          `${styleLayer.type}-opacity`,
          layerConfig.opacity
        );
      });
    });
  }
};

// Functions for OpenSearch maps vector tile layer
export const OSMLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    // If layer already exist in maplibre source, update layer config
    // else add new layer.
    if (layerExistInMbSource(layerConfig, maplibreRef)) {
      updateLayerConfig(layerConfig, maplibreRef);
    } else {
      addNewLayer(layerConfig, maplibreRef);
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((mbLayer: { id: any }) => {
      if (mbLayer.id.includes(layerConfig.id)) {
        maplibreRef.current?.removeLayer(mbLayer.id);
      }
    });
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((mbLayer: { id: any }) => {
      if (mbLayer.id.includes(layerConfig.id)) {
        maplibreRef.current?.setLayoutProperty(mbLayer.id, 'visibility', layerConfig.visibility);
      }
    });
  },
};
