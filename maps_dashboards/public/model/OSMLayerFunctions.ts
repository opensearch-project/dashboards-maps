import { Map as Maplibre, LayerSpecification } from 'maplibre-gl';
import { OSMLayerSpecification } from './mapLayerType';

interface MaplibreRef {
  current: Maplibre | null;
}

// Fetch style layers from OpenSearch vector tile service
const fetchStyleLayers = (url: string) => {
  return fetch(url)
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

const handleStyleLayers = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
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
        layerConfig.opacity / 100
      );
    }
  });
};

const layerExistInMbSource = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  const layers = getCurrentStyleLayers(maplibreRef);
  for (const layer in layers) {
    if (layers[layer].id.includes(layerConfig.id)) {
      return true;
    }
  }
  return false;
};

const updateLayerConfig = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  if (maplibreRef.current) {
    handleStyleLayers(layerConfig, maplibreRef);
  }
};

const addNewLayer = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  if (maplibreRef.current) {
    const layerSource = layerConfig?.source;
    const layerStyle = layerConfig?.style;
    maplibreRef.current.addSource(layerConfig.id, {
      type: 'vector',
      url: layerSource?.dataURL,
    });
    fetchStyleLayers(layerStyle?.styleURL).then((styleLayers: LayerSpecification[]) => {
      styleLayers.forEach((styleLayer) => {
        styleLayer.id = styleLayer.id + '_' + layerConfig.id;
        if (styleLayer.type !== 'background') {
          styleLayer.source = layerConfig.id;
        }
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
          layerConfig.opacity / 100
        );
      });
    });
  }
};

// Functions for OpenSearch maps vector tile layer
export const OSMLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    // If layer already exist in maplibre source, update layer config
    // else add new layer.
    if (layerExistInMbSource(layerConfig, maplibreRef)) {
      updateLayerConfig(layerConfig, maplibreRef);
    } else {
      addNewLayer(layerConfig, maplibreRef);
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((mbLayer: { id: any }) => {
      if (mbLayer.id.includes(layerConfig.id)) {
        maplibreRef.current?.removeLayer(mbLayer.id);
      }
    });
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((mbLayer: { id: any }) => {
      if (mbLayer.id.includes(layerConfig.id)) {
        maplibreRef.current?.setLayoutProperty(mbLayer.id, 'visibility', layerConfig.visibility);
      }
    });
  },
};
