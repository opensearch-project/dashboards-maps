/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';
import { MapLayerSpecification } from './mapLayerType';
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
  Query,
  FILTERS,
} from '../../../../src/plugins/data/common';
import { getDataLayers, getBaseLayers, layersFunctionMap } from './layersFunctions';
import { MapServices } from '../types';
import { MapState } from './mapState';
import { GeoBounds, getBounds } from './map/boundary';
import { buildBBoxFilter, buildGeoShapeFilter } from './geo/filter';

interface MaplibreRef {
  current: Maplibre | null;
}

const getSupportedOperations = (field: string): GeoShapeRelation[] => {
  switch (field) {
    case 'geo_point':
      return ['intersects'];
    case 'geo_shape':
      return ['intersects', 'within', 'disjoint'];
    default:
      return [];
  }
};

export const prepareDataLayerSource = (
  layer: MapLayerSpecification,
  mapState: MapState,
  { data, toastNotifications }: MapServices,
  filters: Filter[] = [],
  timeRange?: TimeRange,
  query?: Query
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
      const label = layer.style.label;
      if (label && label.enabled && label.textType === 'by_field' && label.textByField.length > 0) {
        sourceFields.push(label.textByField);
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
        buildQuery = buildOpenSearchQuery(indexPattern, query ? [query] : [], [
          ...filters,
          ...(layer.source.filters ? layer.source.filters : []),
          ...(timeFilters ? [timeFilters] : []),
        ]);
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
  mapLayer: MapLayerSpecification,
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  timeRange?: TimeRange,
  filtersFromDashboard?: Filter[],
  query?: Query
) => {
  if (mapLayer.type !== DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
    return;
  }
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
    type: FILTERS.GEO_BOUNDING_BOX,
  };
  const geoBoundingBoxFilter: GeoBoundingBoxFilter = buildBBoxFilter(geoField, mapBounds, meta);
  filters.push(geoBoundingBoxFilter);

  // build and add GeoShape filters from map state if applicable
  if (mapLayer.source?.applyGlobalFilter ?? true) {
    mapState?.spatialMetaFilters?.map((value) => {
      if (getSupportedOperations(geoFieldType).includes(value.params.relation)) {
        filters.push(buildGeoShapeFilter(geoField, value));
      }
    });
  }

  return prepareDataLayerSource(mapLayer, mapState, services, filters, timeRange, query).then(
    (result) => {
      const { layer, dataSource } = result;
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
        layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource);
      }
    }
  );
};

export const handleBaseLayerRender = (
  layer: MapLayerSpecification,
  maplibreRef: MaplibreRef
): void => {
  layersFunctionMap[layer.type].render(maplibreRef, layer);
};

export const renderDataLayers = (
  layers: MapLayerSpecification[],
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  timeRange?: TimeRange,
  filtersFromDashboard?: Filter[],
  query?: Query
): void => {
  getDataLayers(layers).forEach((layer) => {
    handleDataLayerRender(
      layer,
      mapState,
      services,
      maplibreRef,
      timeRange,
      filtersFromDashboard,
      query
    );
  });
};

export const renderBaseLayers = (
  layers: MapLayerSpecification[],
  maplibreRef: MaplibreRef
): void => {
  getBaseLayers(layers).forEach((layer) => {
    handleBaseLayerRender(layer, maplibreRef);
  });
};

// Order maplibre layers based on the order of dashboard-maps layers
export const orderLayers = (mapLayers: MapLayerSpecification[], maplibre: Maplibre): void => {
  const maplibreLayers = maplibre.getStyle().layers;
  if (!maplibreLayers) return;
  mapLayers.forEach((layer) => {
    const layerId = layer.id;
    const mbLayers = maplibreLayers.filter((mbLayer) => mbLayer.id.includes(layerId));
    mbLayers.forEach((mbLayer, index) => {
      maplibre.moveLayer(mbLayer.id);
    });
  });
};
