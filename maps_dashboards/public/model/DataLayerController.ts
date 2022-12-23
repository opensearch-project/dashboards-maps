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

export const doDataLayerRender = async (
  layer: MapLayerSpecification,
  mapState: MapState,
  { data, notifications }: MapServices,
  maplibreRef: MaplibreRef
) => {
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
          const dataSource = response.rawResponse.hits.hits;
          layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource);
          // layersFunctionMap[layer.type].addTooltip(maplibreRef, layer);
          search$.unsubscribe();
        } else {
          notifications.toasts.addWarning('An error has occurred when query dataSource');
          search$.unsubscribe();
        }
      },
      error: (e: Error) => {
        data.search.showError(e);
      },
    });
  }
};
