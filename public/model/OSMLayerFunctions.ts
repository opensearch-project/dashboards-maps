import { LayerSpecification, SymbolLayerSpecification } from 'maplibre-gl';
import { OSMLayerSpecification } from './mapLayerType';
import {
  addOSMLayerSource,
  addOSMStyleLayer,
  getLayers,
  hasLayer,
  getOSMStyleLayerWithMapLayerId,
  updateOSMStyleLayer,
} from './map/layer_operations';
import { getMapLanguage } from '../../common/util';
import { MaplibreRef } from './layersFunctions';
import { MapsServiceError } from '../components/map_container/map_container';

const fetchDataLayer = (dataUrl: string) => {
  return fetch(dataUrl)
    .then(() => true)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
      throw new MapsServiceError(error.message);
    });
};

// Fetch style layers from OpenSearch vector tile service
const fetchStyleLayers = (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((json) => json.layers)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
      throw new MapsServiceError(error.message);
    });
};

const handleStyleLayers = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  getLayers(maplibreRef.current!, layerConfig.id).forEach((mbLayer) => {
    updateOSMStyleLayer(maplibreRef.current!, layerConfig, mbLayer);
  });
};

const updateLayerConfig = (layerConfig: OSMLayerSpecification, maplibreRef: MaplibreRef) => {
  handleStyleLayers(layerConfig, maplibreRef);
};

const setLanguage = (maplibreRef: MaplibreRef, styleLayer: LayerSpecification) => {
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
  onError: Function
) => {
  if (maplibreRef.current) {
    const maplibre = maplibreRef.current;
    const { id, source, style } = layerConfig;
    fetchDataLayer(source.dataURL)
      .then(() => {
        addOSMLayerSource(maplibre, id, source.dataURL);
        fetchStyleLayers(style?.styleURL)
          .then((styleLayers: LayerSpecification[]) => {
            styleLayers.forEach((layer) => {
              const styleLayer = getOSMStyleLayerWithMapLayerId(id, layer);
              addOSMStyleLayer(maplibre, layerConfig, styleLayer);
              setLanguage(maplibreRef, styleLayer);
            });
          })
          .catch((e) => {
            if (onError) {
              onError(e);
            }
          });
      })
      .catch((e) => {
        if (onError) {
          onError(e);
        }
      });
  }
};

// Functions for OpenSearch maps vector tile layer
export const OSMLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification, onError: Function) => {
    // If layer already exist in maplibre source, update layer config
    // else add new layer.
    return hasLayer(maplibreRef.current!, layerConfig.id)
      ? updateLayerConfig(layerConfig, maplibreRef)
      : addNewLayer(layerConfig, maplibreRef, onError);
  },
};
