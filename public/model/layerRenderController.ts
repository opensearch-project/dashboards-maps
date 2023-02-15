/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { DocumentLayerSpecification, MapLayerSpecification } from './mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import {
  buildOpenSearchQuery,
  Filter,
  FilterMeta,
  GeoBoundingBoxFilter,
  getTime,
  IOpenSearchDashboardsSearchResponse,
  isCompleteResponse,
  TimeRange,
} from '../../../../src/plugins/data/common';
import { layersFunctionMap } from './layersFunctions';
import { MapServices } from '../types';
import { MapState } from './mapState';
import { GeoBounds, getBounds } from './map/boundary';
import { buildBBoxFilter } from './geo/filter';

interface MaplibreRef {
  current: Maplibre | null;
}

export const prepareDataLayerSource = (
  layer: MapLayerSpecification,
  mapState: MapState,
  { data, toastNotifications }: MapServices,
  filters: Filter[] = [],
  timeRange?: TimeRange
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
      let selectedTimeRange;
      if (indexPattern) {
        if (timeRange) {
          selectedTimeRange = timeRange;
        } else {
          selectedTimeRange = mapState.timeRange;
        }
        const timeFilters = getTime(indexPattern, selectedTimeRange);
        buildQuery = buildOpenSearchQuery(
          indexPattern,
          [],
          [
            ...filters,
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
            toastNotifications.addWarning('An error has occurred when query dataSource');
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
  mapLayer: DocumentLayerSpecification,
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined,
  timeRange?: TimeRange,
  filtersFromDashboard?: Filter[]
) => {
  // filters are passed from dashboard filters and geo bounding box filters
  const filters: Filter[] = [];
  filters.push(...(filtersFromDashboard ? filtersFromDashboard : []));
  const geoField = mapLayer.source.geoFieldName;
  const geoFieldType = mapLayer.source.geoFieldType;

  // geo bounding box query supports geo_point fields
  const mapBounds: GeoBounds = getBounds(maplibreRef.current!);
  const meta: FilterMeta = {
    alias: null,
    disabled: !mapLayer.source.useGeoBoundingBoxFilter || geoFieldType !== 'geo_point',
    negate: false,
  };
  const geoBoundingBoxFilter: GeoBoundingBoxFilter = buildBBoxFilter(geoField, mapBounds, meta);
  filters.push(geoBoundingBoxFilter);

  return prepareDataLayerSource(mapLayer, mapState, services, filters, timeRange).then((result) => {
    const { layer, dataSource } = result;
    if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
      layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource, beforeLayerId);
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
