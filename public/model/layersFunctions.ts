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
import {
  BaseLayerSpecification,
  DataLayerSpecification,
  MapLayerSpecification,
} from './mapLayerType';
import { CustomLayerFunctions } from './customLayerFunctions';
import { getLayers } from './map/layer_operations';
import { ClusterLayerFunctions } from './clusterLayerFunctions';

export interface MaplibreRef {
  current: Maplibre | null;
}

export const layersFunctionMap: { [key: string]: any } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: OSMLayerFunctions,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DocumentLayerFunctions,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: CustomLayerFunctions,
  [DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER]: ClusterLayerFunctions,
};

export const layersTypeNameMap: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DASHBOARDS_MAPS_LAYER_NAME.DOCUMENTS,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: DASHBOARDS_MAPS_LAYER_NAME.CUSTOM_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER]: DASHBOARDS_MAPS_LAYER_NAME.CLUSTER,
};

export const layersTypeIconMap: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: DASHBOARDS_MAPS_LAYER_ICON.OPENSEARCH_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DASHBOARDS_MAPS_LAYER_ICON.DOCUMENTS,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: DASHBOARDS_MAPS_LAYER_ICON.CUSTOM_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER]: DASHBOARDS_MAPS_LAYER_ICON.CLUSTER,
};

export const baseLayerTypeLookup = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: true,
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: true,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: false,
  [DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER]: false,
};

export const getDataLayers = (layers: MapLayerSpecification[]): DataLayerSpecification[] => {
  return layers.filter((layer) => !baseLayerTypeLookup[layer.type]) as DataLayerSpecification[];
};

export const getBaseLayers = (layers: MapLayerSpecification[]): BaseLayerSpecification[] => {
  return layers.filter((layer) => baseLayerTypeLookup[layer.type]) as BaseLayerSpecification[];
};

export const getMaplibreAboveLayerId = (
  mapLayerId: string,
  maplibre: Maplibre
): string | undefined => {
  const currentLoadedMbLayers = getLayers(maplibre);
  const matchingMbLayers = currentLoadedMbLayers.filter((mbLayer) =>
    mbLayer.id.includes(mapLayerId)
  );
  if (matchingMbLayers.length > 0) {
    const highestMbLayerIndex = currentLoadedMbLayers.indexOf(
      matchingMbLayers[matchingMbLayers.length - 1]
    );
    const aboveMbLayer = currentLoadedMbLayers[highestMbLayerIndex + 1];
    return aboveMbLayer?.id;
  }
  return undefined;
};
