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
import { DEFAULT_VECTOR_TILE_STYLES } from '../../common';
import { MapServices } from '../types';

const fetchDataLayer = (dataUrl: string) => {
  return fetch(dataUrl)
    .then(() => true)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
      throw new MapsServiceError(error.message);
    });
};

const fetchStylesManifest = (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .catch((error) => {
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

const fetchStyleURL = async (services: MapServices, appliedStyle: string): Promise<string> => {
  const styleManifestURL = services.mapConfig.opensearchVectorTileStyleUrl;
  const styleManifest = await fetchStylesManifest(styleManifestURL);
  return styleManifest.services.find(
    (style: { id: string; url: string }) => style.id === appliedStyle
  )?.url;
};

const addNewLayer = async (
  layerConfig: OSMLayerSpecification,
  maplibreRef: MaplibreRef,
  services: MapServices,
  onError: Function
) => {
  if (!maplibreRef.current) return;

  const maplibre = maplibreRef.current;
  const vectorTileDataUrl = services.mapConfig.opensearchVectorTileDataUrl;

  try {
    await fetchDataLayer(vectorTileDataUrl);
    addOSMLayerSource(maplibre, layerConfig.id, vectorTileDataUrl);

    const isDarkModeEnabled = services.uiSettings.get('theme:darkMode');
    const appliedStyle = isDarkModeEnabled
      ? DEFAULT_VECTOR_TILE_STYLES.DARK
      : DEFAULT_VECTOR_TILE_STYLES.BASIC;

    const styleURL = await fetchStyleURL(services, appliedStyle);

    const styleLayers: LayerSpecification[] = await fetchStyleLayers(styleURL);

    styleLayers.forEach((layer) => {
      const styleLayer = getOSMStyleLayerWithMapLayerId(layerConfig.id, layer);
      addOSMStyleLayer(maplibre, layerConfig, styleLayer);
      setLanguage(maplibreRef, styleLayer);
    });
  } catch (e) {
    if (onError) {
      onError(e);
    }
  }
};

// Functions for OpenSearch maps vector tile layer
export const OSMLayerFunctions = {
  render: (
    maplibreRef: MaplibreRef,
    layerConfig: OSMLayerSpecification,
    services: MapServices,
    onError: Function
  ) => {
    // If layer already exist in maplibre source, update layer config
    // else add new layer.
    return hasLayer(maplibreRef.current!, layerConfig.id)
      ? updateLayerConfig(layerConfig, maplibreRef)
      : addNewLayer(layerConfig, maplibreRef, services, onError);
  },
};
