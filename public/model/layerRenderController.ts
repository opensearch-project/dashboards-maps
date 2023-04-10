/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';
import { DataLayerSpecification, MapLayerSpecification } from './mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import {
  buildOpenSearchQuery,
  Filter,
  FilterMeta,
  FILTERS,
  GeoBoundingBoxFilter,
  getTime,
  IOpenSearchDashboardsSearchResponse,
  isCompleteResponse,
  Query,
  TimeRange,
} from '../../../../src/plugins/data/common';
import { getBaseLayers, getDataLayers, layersFunctionMap, MaplibreRef } from './layersFunctions';
import { MapServices } from '../types';
import { MapState } from './mapState';
import { GeoBounds, getBounds } from './map/boundary';
import { buildBBoxFilter, buildGeoShapeFilter } from './geo/filter';
import { DashboardProps } from '../components/map_page/map_page';

interface MapGlobalStates {
  timeRange: TimeRange;
  query: Query;
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
  maplibreRef: MaplibreRef,
  dashboardProps?: DashboardProps
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
      let mergedQuery;
      if (indexPattern) {
        const { timeRange: selectedTimeRange, query: selectedSearchQuery } = getGlobalStates(
          mapState,
          dashboardProps
        );
        const timeFilters = getTime(indexPattern, selectedTimeRange);
        const mergedFilters = getMergedFilters(layer, mapState, maplibreRef, dashboardProps);
        mergedQuery = buildOpenSearchQuery(indexPattern, selectedSearchQuery, [
          ...mergedFilters,
          ...(timeFilters ? [timeFilters] : []),
        ]);
      }
      const request = {
        params: {
          index: indexPatternRefName,
          size: layer.source.documentRequestNumber,
          body: {
            _source: sourceFields,
            query: mergedQuery,
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
  mapLayer: DataLayerSpecification,
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  dashboardProps?: DashboardProps
) => {
  return prepareDataLayerSource(mapLayer, mapState, services, maplibreRef, dashboardProps).then(
    (result) => {
      const { layer, dataSource } = result;
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
        layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource);
      }
    }
  );
};

const getMergedFilters = (
  mapLayer: DataLayerSpecification,
  mapState: MapState,
  maplibre: MaplibreRef,
  dashboardProps?: DashboardProps
): Filter[] => {
  const mergedFilters: Filter[] = [];

  // add layer local filters if applicable
  if (mapLayer.source.filters) {
    mergedFilters.push(...mapLayer.source.filters);
  }

  // add dashboard filters if applicable
  if (dashboardProps?.filters) {
    mergedFilters.push(...dashboardProps.filters);
  }

  // add global filters from map state if applicable
  if (mapLayer.source?.applyGlobalFilters ?? true) {
    // add spatial filters from map state if applicable
    if (mapState?.spatialMetaFilters) {
      const geoField = mapLayer.source.geoFieldName;
      const geoFieldType = mapLayer.source.geoFieldType;
      mapState?.spatialMetaFilters?.map((value) => {
        if (getSupportedOperations(geoFieldType).includes(value.params.relation)) {
          mergedFilters.push(buildGeoShapeFilter(geoField, value));
        }
      });
    }
  }

  // build and add GeoBoundingBox filter from map state if applicable
  const geoBoundingBoxFilter = getGeoBoundingBoxFilter(mapLayer, maplibre);
  mergedFilters.push(geoBoundingBoxFilter);
  return mergedFilters;
};

const getGeoBoundingBoxFilter = (
  mapLayer: DataLayerSpecification,
  maplibreRef: MaplibreRef
): GeoBoundingBoxFilter => {
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
  return buildBBoxFilter(geoField, mapBounds, meta);
};

const getGlobalStates = (mapState: MapState, dashboardProps?: DashboardProps): MapGlobalStates => {
  if (!!dashboardProps) {
    if (!dashboardProps.timeRange) {
      throw new Error('timeRange is not defined in dashboard mode');
    }
    if (!dashboardProps.query) {
      throw new Error('query is not defined in dashboard mode');
    }
    return {
      timeRange: dashboardProps.timeRange,
      query: dashboardProps.query,
    };
  } else {
    return {
      timeRange: mapState.timeRange,
      query: mapState.query,
    };
  }
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
  dashboardProps?: DashboardProps
): void => {
  getDataLayers(layers).forEach((layer) => {
    handleDataLayerRender(layer, mapState, services, maplibreRef, dashboardProps);
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
