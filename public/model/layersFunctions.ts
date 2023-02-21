/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import {
  DASHBOARDS_MAPS_LAYER_ICON,
  DASHBOARDS_MAPS_LAYER_NAME,
  DASHBOARDS_MAPS_LAYER_TYPE,
} from '../../common';
import { OSMLayerFunctions } from './OSMLayerFunctions';
import { DocumentLayerFunctions } from './documentLayerFunctions';
import { MapLayerSpecification } from './mapLayerType';
import { CustomLayerFunctions } from './customLayerFunctions';
import { getLayers } from './map/layer_operations';

interface MaplibreRef {
  current: Maplibre | null;
}

interface MaplibreRef {
  current: Maplibre | null;
}

export const layersFunctionMap: { [key: string]: any } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: OSMLayerFunctions,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DocumentLayerFunctions,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: CustomLayerFunctions,
};

export const layersTypeNameMap: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DASHBOARDS_MAPS_LAYER_NAME.DOCUMENTS,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: DASHBOARDS_MAPS_LAYER_NAME.CUSTOM_MAP,
};

export const getMaplibreBeforeLayerId = (
  selectedLayer: MapLayerSpecification,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
): string | undefined => {
  const currentLoadedMbLayers = getLayers(maplibreRef.current!);
  if (beforeLayerId) {
    const beforeMbLayer = currentLoadedMbLayers.find((mbLayer) =>
      mbLayer.id.includes(beforeLayerId)
    );
    return beforeMbLayer?.id;
  }
  return undefined;
};

export const layersTypeIconMap: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: DASHBOARDS_MAPS_LAYER_ICON.OPENSEARCH_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DASHBOARDS_MAPS_LAYER_ICON.DOCUMENTS,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: DASHBOARDS_MAPS_LAYER_ICON.CUSTOM_MAP,
};

export const referenceLayerTypeLookup = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: true,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: true,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: false,
};

export const getDataLayers = (layers: MapLayerSpecification[]) => {
  return layers.filter((layer) => !referenceLayerTypeLookup[layer.type]);
};

export const getReferenceLayers = (layers: MapLayerSpecification[]) => {
  return layers.filter((layer) => referenceLayerTypeLookup[layer.type]);
};

// Get layer id from layers that is above the selected layer
export const getMapBeforeLayerId = (
  layers: MapLayerSpecification[],
  selectedLayerId: string
): string | undefined => {
  const selectedLayerIndex = layers.findIndex((layer) => layer.id === selectedLayerId);
  const beforeLayers = layers.slice(selectedLayerIndex + 1);
  if (beforeLayers.length === 0) {
    return undefined;
  }
  return beforeLayers[0]?.id;
};
