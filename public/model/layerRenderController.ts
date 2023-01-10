/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LngLatBounds, Map as Maplibre } from 'maplibre-gl';
import { DocumentLayerSpecification, MapLayerSpecification } from './mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE, MAX_LONGITUDE, MIN_LONGITUDE } from '../../common';
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

// calculate lng limits based on map bounds
// maps can render more than 1 copies of map at lower zoom level and displays
// one side from 1 copy and other side from other copy at higher zoom level if
// screen crosses internation dateline
function calculateBoundingBoxLngLimit(bounds: LngLatBounds) {
  const boundsMinLng = bounds.getNorthWest().lng;
  const boundsMaxLng = bounds.getSouthEast().lng;
  // if bounds expands more than 360 then, consider complete globe is visible
  if (boundsMaxLng - boundsMinLng >= MAX_LONGITUDE - MIN_LONGITUDE) {
    return {
      right: MAX_LONGITUDE,
      left: MIN_LONGITUDE,
    };
  }
  // wrap bounds if only portion of globe is visible
  // wrap() returns a new LngLat object whose longitude is
  // wrapped to the range (-180, 180).
  return {
    right: bounds.getSouthEast().wrap().lng,
    left: bounds.getNorthWest().wrap().lng,
  };
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
    const lngLimit = calculateBoundingBoxLngLimit(mapBounds);
    const filterBoundingBox = {
      bottom_right: {
        lon: lngLimit.right,
        lat: mapBounds.getSouthEast().lat,
      },
      top_left: {
        lon: lngLimit.left,
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
