import { Map as Maplibre, LayerSpecification, SymbolLayerSpecification } from 'maplibre-gl';
import { OSMLayerSpecification } from './mapLayerType';
import { getMaplibreBeforeLayerId } from './layersFunctions';
import { getLayers, hasLayer } from './map/layer_operations';
import { getMapLanguage } from '../../common/util';

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

const handleStyleLayers = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  getLayers(maplibreRef.current!, layerConfig.id).forEach((mbLayer) => {
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
  });
};

const updateLayerConfig = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  handleStyleLayers(layerConfig, maplibreRef);
};

const localizationMapLayer = (maplibreRef: MaplibreRef, styleLayer: LayerSpecification) => {
  // if a layer contains label, we will set its language.
  if (styleLayer.layout && (styleLayer as SymbolLayerSpecification).layout?.['text-field']) {
    const language = getMapLanguage();
    maplibreRef.current?.setLayoutProperty(styleLayer.id, 'text-field', [
      'get',
      'name:' + language,
    ]);
  }
};

const addNewLayer = (
  layerConfig: OSMLayerSpecification,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
) => {
  if (maplibreRef.current) {
    const { source, style } = layerConfig;
    maplibreRef.current.addSource(layerConfig.id, {
      type: 'vector',
      url: source?.dataURL,
    });
    fetchStyleLayers(style?.styleURL).then((styleLayers: LayerSpecification[]) => {
      const beforeMbLayerId = getMaplibreBeforeLayerId(layerConfig, maplibreRef, beforeLayerId);
      styleLayers.forEach((styleLayer) => {
        styleLayer.id = styleLayer.id + '_' + layerConfig.id;
        // TODO: Add comments on why we skip background type
        if (styleLayer.type !== 'background') {
          styleLayer.source = layerConfig.id;
        }
        maplibreRef.current?.addLayer(styleLayer, beforeMbLayerId);
        localizationMapLayer(maplibreRef, styleLayer);
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
  render: (
    maplibreRef: MaplibreRef,
    layerConfig: OSMLayerSpecification,
    beforeLayerId: string | undefined
  ) => {
    // If layer already exist in maplibre source, update layer config
    // else add new layer.
    return hasLayer(maplibreRef.current!, layerConfig.id)
      ? updateLayerConfig(layerConfig, maplibreRef)
      : addNewLayer(layerConfig, maplibreRef, beforeLayerId);
  },
};
