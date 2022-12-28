/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { MapLayerSpecification } from './mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import {
  buildOpenSearchQuery,
  getTime,
  IOpenSearchDashboardsSearchResponse,
  isCompleteResponse,
} from '../../../../src/plugins/data/common';
import { layersFunctionMap } from './layersFunctions';
import { MapServices } from '../types';
import { MapState } from './mapState';

interface MaplibreRef {
  current: Maplibre | null;
}

export const prepareDataLayerSource = (
  layer: MapLayerSpecification,
  mapState: MapState,
  { data, notifications }: MapServices
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
      const sourceConfig = layer.source;
      const indexPattern = await data.indexPatterns.get(sourceConfig.indexPatternId);
      const indexPatternRefName = sourceConfig?.indexPatternRefName;
      const geoField = sourceConfig.geoFieldName;
      const sourceFields: string[] = [geoField];
      if (sourceConfig.showTooltips && sourceConfig.tooltipFields.length > 0) {
        sourceFields.push(...sourceConfig.tooltipFields);
      }
      let buildQuery;
      if (indexPattern) {
        const timeFilters = getTime(indexPattern, mapState.timeRange);
        buildQuery = buildOpenSearchQuery(
          indexPattern,
          [],
          [
            ...(layer.source.filters ? layer.source.filters : []),
            ...(timeFilters ? [timeFilters] : []),
          ]
        );
      }
      const request = {
        params: {
          index: indexPatternRefName,
          size: layer.source.documentRequestNumber,
          body: {
            _source: sourceFields,
            query: buildQuery,
          },
        },
      };

      const search$ = data.search.search(request).subscribe({
        next: (response: IOpenSearchDashboardsSearchResponse) => {
          if (isCompleteResponse(response)) {
            const dataSource: object = response.rawResponse.hits.hits;
            search$.unsubscribe();
            resolve({ dataSource, layer });
          } else {
            notifications.toasts.addWarning('An error has occurred when query dataSource');
            search$.unsubscribe();
            reject();
          }
        },
        error: (e: Error) => {
          data.search.showError(e);
        },
      });
    }
  });
};

export const handleDataLayerRender = (
  mapLayer: MapLayerSpecification,
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
) => {
  return prepareDataLayerSource(mapLayer, mapState, services).then((result) => {
    const { layer, dataSource } = result;
    if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
      layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource, beforeLayerId);
      layersFunctionMap[layer.type].addTooltip(maplibreRef, layer);
    }
  });
};

export const handleReferenceLayerRender = (
  layer: MapLayerSpecification,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
) => {
  layersFunctionMap[layer.type].render(maplibreRef, layer, beforeLayerId);
};
