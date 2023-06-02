/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre } from 'maplibre-gl';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';
import { MapLayerSpecification, DataLayerSpecification } from './mapLayerType';
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
import { buildAgg } from './agg/build_agg';
import { MapsLegendHandle } from '../components/map_container/legend';

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
  layer: DataLayerSpecification,
  mapState: MapState,
  { data, toastNotifications }: MapServices,
  maplibreRef: MaplibreRef,
  dashboardProps?: DashboardProps
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (
      layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS ||
      layer.type === DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER
    ) {
      const sourceConfig = layer.source;
      const indexPattern = await data.indexPatterns.get(sourceConfig.indexPatternId);
      const indexPatternRefName = sourceConfig?.indexPatternRefName;
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
      let request = {};
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
        const geoField = layer.source.geoFieldName;
        const sourceFields: string[] = [geoField];
        if (layer.source.showTooltips && layer.source.tooltipFields.length > 0) {
          sourceFields.push(...layer.source.tooltipFields);
        }
        const label = layer.style.label;
        if (
          label &&
          label.enabled &&
          label.textType === 'by_field' &&
          label.textByField.length > 0
        ) {
          sourceFields.push(label.textByField);
        }
        request = {
          params: {
            index: indexPatternRefName,
            size: layer.source.documentRequestNumber,
            body: {
              _source: sourceFields,
              query: mergedQuery,
            },
          },
        };
      } else if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER) {
        const zoom = maplibreRef.current?.getZoom() ?? 1;
        const aggs = buildAgg(layer.source, zoom);
        request = {
          params: {
            index: indexPatternRefName,
            body: {
              aggs,
              _source: { excludes: [] },
              query: mergedQuery,
            },
          },
        };
      }

      const search$ = data.search.search(request).subscribe({
        next: (response: IOpenSearchDashboardsSearchResponse) => {
          if (isCompleteResponse(response)) {
            let dataSource: object;
            if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
              dataSource = response.rawResponse.hits.hits;
            } else {
              dataSource = response.rawResponse.aggregations;
            }
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
  legendRef: React.RefObject<Partial<MapsLegendHandle>>,
  dashboardProps?: DashboardProps
) => {
  return prepareDataLayerSource(mapLayer, mapState, services, maplibreRef, dashboardProps).then(
    (result) => {
      const { layer, dataSource } = result;
      layersFunctionMap[layer.type].render(maplibreRef, layer, dataSource, legendRef);
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
      const geoField =
        mapLayer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS
          ? mapLayer.source.geoFieldName
          : mapLayer.source.cluster.field;
      const geoFieldType =
        mapLayer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS
          ? mapLayer.source.geoFieldType
          : mapLayer.source.cluster.fieldType;
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
  const geoField =
    mapLayer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS
      ? mapLayer.source.geoFieldName
      : mapLayer.source.cluster.field;
  const geoFieldType =
    mapLayer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS
      ? mapLayer.source.geoFieldType
      : mapLayer.source.cluster.fieldType;

  // geo bounding box query supports geo_point fields
  const mapBounds: GeoBounds = getBounds(maplibreRef.current!);
  const meta: FilterMeta = {
    alias: null,
    disabled:
      !mapLayer.source.useGeoBoundingBoxFilter ||
      (mapLayer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS && geoFieldType !== 'geo_point'),
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
  maplibreRef: MaplibreRef,
  onError: Function
): void => {
  layersFunctionMap[layer.type].render(maplibreRef, layer, onError);
};

export const renderDataLayers = (
  layers: MapLayerSpecification[],
  mapState: MapState,
  services: MapServices,
  maplibreRef: MaplibreRef,
  legendRef: React.RefObject<MapsLegendHandle>,
  dashboardProps?: DashboardProps
): void => {
  getDataLayers(layers).forEach((layer) => {
    handleDataLayerRender(layer, mapState, services, maplibreRef, legendRef, dashboardProps);
  });
};

export const renderBaseLayers = (
  layers: MapLayerSpecification[],
  maplibreRef: MaplibreRef,
  onError: Function
): void => {
  getBaseLayers(layers).forEach((layer) => {
    handleBaseLayerRender(layer, maplibreRef, onError);
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
