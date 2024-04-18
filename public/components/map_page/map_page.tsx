/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Map as Maplibre } from 'maplibre-gl';
import classNames from 'classnames';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';
import { SimpleSavedObject } from '../../../../../src/core/public';
import { MapContainer } from '../map_container';
import { MapTopNavMenu } from '../map_top_nav';
import { MapServices } from '../../types';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import {
  DASHBOARDS_MAPS_LAYER_TYPE,
  MAP_LAYER_DEFAULT_NAME,
  OPENSEARCH_MAP_LAYER,
} from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { getLayerConfigMap, getInitialMapState } from '../../utils/getIntialConfig';
import {
  Filter,
  IndexPattern,
  RefreshInterval,
  TimeRange,
  Query,
} from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import { GeoShapeFilterMeta, ShapeFilter } from '../../../../../src/plugins/data/common';
import { buildGeoShapeFilterMeta } from '../../model/geo/filter';
import { FilterBar } from '../filter_bar/filter_bar';

export interface DashboardProps {
  timeRange?: TimeRange;
  refreshConfig?: RefreshInterval;
  filters?: Filter[];
  query?: Query;
}

interface MapComponentProps {
  mapIdFromSavedObject: string;
  dashboardProps?: DashboardProps;
}

export const MapComponent = ({ mapIdFromSavedObject, dashboardProps }: MapComponentProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    savedObjects: { client: savedObjectsClient },
  } = services;
  const [layers, setLayers] = useState<MapLayerSpecification[]>([]);
  const [savedMapObject, setSavedMapObject] = useState<SimpleSavedObject<
    MapSavedObjectAttributes
  > | null>();
  const [layersIndexPatterns, setLayersIndexPatterns] = useState<IndexPattern[]>([]);
  const maplibreRef = useRef<Maplibre | null>(null);
  const [mapState, setMapState] = useState<MapState>(getInitialMapState());
  const [isUpdatingLayerRender, setIsUpdatingLayerRender] = useState(true);
  const isReadOnlyMode = !!dashboardProps;
  const [dataSourceRefIds, setDataSourceRefIds] = useState<string[]>([]);
  const [dataLoadReady, setDataLoadReady] = useState(false);

  useEffect(() => {
    if (mapIdFromSavedObject) {
      savedObjectsClient.get<MapSavedObjectAttributes>('map', mapIdFromSavedObject).then((res) => {
        setSavedMapObject(res);
        const layerList: MapLayerSpecification[] = JSON.parse(res.attributes.layerList as string);
        const savedMapState: MapState = JSON.parse(res.attributes.mapState as string);
        setMapState(savedMapState);
        setLayers(layerList);
        const savedIndexPatterns: IndexPattern[] = [];
        const remoteDataSourceIds: string[] = [];

        const fetchDataLayer = async () => {
          const requests = layerList
            .filter((layer) => layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS)
            .map((layer) => services.data.indexPatterns.get(layer.source.indexPatternId));

          const resp = await Promise.all(requests);
          resp.forEach((response: IndexPattern) => {
            savedIndexPatterns.push(response);
            if (response.dataSourceRef && !dataSourceRefIds.includes(response.dataSourceRef.id)) {
              remoteDataSourceIds.push(response.dataSourceRef.id);
            } else if (!response.dataSourceRef && !remoteDataSourceIds.includes('')) {
              // If index pattern of the layer doesn't have reference to a data source, it is using local cluster
              remoteDataSourceIds.push('');
            }
          });

          setLayers(layerList);
          setLayersIndexPatterns(savedIndexPatterns);
          setDataSourceRefIds(remoteDataSourceIds);
          setDataLoadReady(true);
        };

        fetchDataLayer();
      });
    } else {
      const initialDefaultLayer: MapLayerSpecification = getLayerConfigMap()[
        OPENSEARCH_MAP_LAYER.type
      ] as MapLayerSpecification;
      initialDefaultLayer.name = MAP_LAYER_DEFAULT_NAME;
      setLayers([initialDefaultLayer]);
      setDataLoadReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSpatialFilter = (
    shape: ShapeFilter,
    label: string | null,
    relation: GeoShapeRelation
  ) => {
    const filterMeta: GeoShapeFilterMeta = buildGeoShapeFilterMeta(label, shape, relation);
    const geoShapeFilterMeta: GeoShapeFilterMeta[] = mapState.spatialMetaFilters || [];
    setMapState({
      ...mapState,
      spatialMetaFilters: [...geoShapeFilterMeta, filterMeta],
    });
  };

  const onFiltersUpdated = (newFilters: GeoShapeFilterMeta[]) => {
    setMapState({
      ...mapState,
      spatialMetaFilters: [...newFilters],
    });
  };

  const filterGroupClasses = classNames('globalFilterGroup__wrapper', {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'globalFilterGroup__wrapper-isVisible': !!mapState.spatialMetaFilters?.length,
  });

  return (
    <div className="map-page">
      {isReadOnlyMode
        ? null
        : dataLoadReady && (
            <MapTopNavMenu
              mapIdFromUrl={mapIdFromSavedObject}
              savedMapObject={savedMapObject}
              layers={layers}
              layersIndexPatterns={layersIndexPatterns}
              maplibreRef={maplibreRef}
              mapState={mapState}
              setMapState={setMapState}
              setIsUpdatingLayerRender={setIsUpdatingLayerRender}
              dataSourceRefIds={dataSourceRefIds}
            />
          )}
      {!isReadOnlyMode && !!mapState.spatialMetaFilters?.length && (
        <div id="SpatiallFilterGroup" className="globalQueryBar">
          <div className={filterGroupClasses}>
            <FilterBar
              className="globalFilterGroup__filterBar"
              filters={mapState.spatialMetaFilters}
              onFiltersUpdated={onFiltersUpdated}
            />
          </div>
        </div>
      )}
      <MapContainer
        layers={layers}
        setLayers={setLayers}
        layersIndexPatterns={layersIndexPatterns}
        setLayersIndexPatterns={setLayersIndexPatterns}
        maplibreRef={maplibreRef}
        mapState={mapState}
        isReadOnlyMode={isReadOnlyMode}
        dashboardProps={dashboardProps}
        isUpdatingLayerRender={isUpdatingLayerRender}
        setIsUpdatingLayerRender={setIsUpdatingLayerRender}
        addSpatialFilter={addSpatialFilter}
        dataSourceRefIds={dataSourceRefIds}
        setDataSourceRefIds={setDataSourceRefIds}
      />
    </div>
  );
};

export const MapPage = () => {
  const { id: mapId } = useParams<{ id: string }>();
  return <MapComponent mapIdFromSavedObject={mapId} />;
};
