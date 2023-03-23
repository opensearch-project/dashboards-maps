/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedObjectsFindResponse } from '../../../../../src/core/server';
import { MapLayerSpecification } from '../../../public/model/mapLayerType';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE, DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';

interface MapAppStats {
  maps_total: number;
  layers_filters_total: number;
  layers_total: { [key: string]: number };
  maps_list: Array<{
    id: string;
    layers_filters_total: number;
    layers_total: { [key: string]: number };
  }>;
}

export const getStats = (
  mapsSavedObjects: SavedObjectsFindResponse<MapSavedObjectAttributes>
): MapAppStats => {
  const totalLayersCountByType = getLayerTypesCountMap();
  let totalLayersFiltersCount = 0;
  const mapsList: Array<{
    id: string;
    layers_filters_total: number;
    layers_total: { [key: string]: number };
  }> = [];
  mapsSavedObjects.saved_objects.forEach((mapRes) => {
    const layersCountByType = getLayerTypesCountMap();
    let layersFiltersCount = 0;
    const layerListJsonString = mapRes.attributes.layerList as string;
    const layerList: MapLayerSpecification[] = layerListJsonString
      ? JSON.parse(layerListJsonString)
      : [];
    layerList.forEach((layer) => {
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP) {
        layersCountByType[layer.source.customType]++;
        totalLayersCountByType[layer.source.customType]++;
      } else {
        layersCountByType[layer.type]++;
        totalLayersCountByType[layer.type]++;
      }
      // @ts-ignore
      const layerFiltersCount = layer.source?.filters?.length ?? 0;
      layersFiltersCount += layerFiltersCount;
      totalLayersFiltersCount += layerFiltersCount;
    });

    mapsList.push({
      id: mapRes.id,
      layers_filters_total: layersFiltersCount,
      layers_total: {
        ...layersCountByType,
      },
    });
  });

  return {
    maps_total: mapsSavedObjects.total,
    layers_filters_total: totalLayersFiltersCount,
    layers_total: {
      ...totalLayersCountByType,
    },
    maps_list: mapsList,
  };
};

export const getLayerTypesCountMap = (): { [key: string]: number } => {
  const layersCountByType: { [key: string]: number } = {};
  Object.values(DASHBOARDS_MAPS_LAYER_TYPE).forEach((layerType) => {
    if (layerType === DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP) {
      Object.values(DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE).forEach((customLayerType) => {
        layersCountByType[customLayerType] = 0;
      });
    } else {
      layersCountByType[layerType] = 0;
    }
  });
  return layersCountByType;
};
