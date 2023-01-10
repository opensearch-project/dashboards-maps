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
  GeoBoundingBoxFilter,
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

// OpenSearch only accepts longitude in range [-180, 180]
// Maplibre could return value out of the range
function adjustLongitudeForSearch(lon: number) {
  if (lon < -180) {
    return -180;
  }
  if (lon > 180) {
    return 180;
  }
  return lon;
}

export const prepareDataLayerSource = (
  layer: MapLayerSpecification,
  mapState: MapState,
  { data, notifications }: MapServices,
  filters: Filter[] = []
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
  mapLayer: DocumentLayerSpecification,
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
) => {
  const filters: Filter[] = [];
  const geoField = mapLayer.source.geoFieldName;
  const geoFieldType = mapLayer.source.geoFieldType;

  // geo bounding box query supports geo_point fields
  if (
    geoFieldType === 'geo_point' &&
    mapLayer.source.useGeoBoundingBoxFilter &&
    maplibreRef.current
  ) {
    const mapBounds = maplibreRef.current.getBounds();
    const filterBoundingBox = {
      bottom_right: {
        lon: adjustLongitudeForSearch(mapBounds.getSouthEast().lng),
        lat: mapBounds.getSouthEast().lat,
      },
      top_left: {
        lon: adjustLongitudeForSearch(mapBounds.getNorthWest().lng),
        lat: mapBounds.getNorthWest().lat,
      },
    };
    const geoBoundingBoxFilter: GeoBoundingBoxFilter = {
      meta: {
        disabled: false,
        negate: false,
        alias: null,
        params: filterBoundingBox,
      },
      geo_bounding_box: {
        [geoField]: filterBoundingBox,
      },
    };
    filters.push(geoBoundingBoxFilter);
  }

  return prepareDataLayerSource(mapLayer, mapState, services, filters).then((result) => {
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
