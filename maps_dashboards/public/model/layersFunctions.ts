/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { DASHBOARDS_MAPS_LAYER_NAME, DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import { OSMLayerFunctions } from './OSMLayerFunctions';
import { DocumentLayerFunctions } from './documentLayerFunctions';

interface MaplibreRef {
  current: Maplibre | null;
}

const getAllMaplibreLayersIncludesId = (maplibreRef: MaplibreRef, layerId?: string) => {
  if (!layerId && !maplibreRef) {
    return [];
  }
  return (
    maplibreRef.current
      ?.getStyle()
      .layers.filter((layer) => layer.id?.includes(String(layerId)) === true) || []
  );
};

export const LayerActions = {
  move: (maplibreRef: MaplibreRef, sourceId: string, beforeId?: string) => {
    const sourceMaplibreLayers = getAllMaplibreLayersIncludesId(maplibreRef, sourceId);
    if (!sourceMaplibreLayers) {
      return;
    }
    const beforeMaplibreLayers = getAllMaplibreLayersIncludesId(maplibreRef, beforeId);
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
};

export const layersTypeNameMap: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DASHBOARDS_MAPS_LAYER_NAME.DOCUMENTS,
};
