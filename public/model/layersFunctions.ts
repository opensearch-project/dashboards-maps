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

export const LayerActions = {
  move: (maplibreRef: MaplibreRef, sourceId: string, beforeId?: string) => {
    const sourceMaplibreLayers = getLayers(maplibreRef.current!, sourceId);
    if (!sourceMaplibreLayers) {
      return;
    }
    const beforeMaplibreLayers = getLayers(maplibreRef.current!, beforeId);
    if (!beforeMaplibreLayers || beforeMaplibreLayers.length < 1) {
      // move to top
      sourceMaplibreLayers.forEach((layer) => maplibreRef.current?.moveLayer(layer.id));
      return;
    }
    const topOfBeforeLayer = beforeMaplibreLayers[0];
    sourceMaplibreLayers.forEach((layer) =>
      maplibreRef.current?.moveLayer(layer.id, topOfBeforeLayer.id)
    );
    return;
  },
};

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
