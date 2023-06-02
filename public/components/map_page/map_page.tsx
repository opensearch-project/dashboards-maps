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
import { MapContainer, MapsContainerHandle } from '../map_container';
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
import { ConfigSchema } from '../../../common/config';
import { GeoShapeFilterMeta, ShapeFilter } from '../../../../../src/plugins/data/common';
import { buildGeoShapeFilterMeta } from '../../model/geo/filter';
import { FilterBar } from '../filter_bar/filter_bar';

interface MapPageProps {
  mapConfig: ConfigSchema;
}

export interface DashboardProps {
  timeRange?: TimeRange;
  refreshConfig?: RefreshInterval;
  filters?: Filter[];
  query?: Query;
}

interface MapComponentProps {
  mapConfig: ConfigSchema;
  mapIdFromSavedObject: string;
  dashboardProps?: DashboardProps;
}

export const MapComponent = ({
  mapIdFromSavedObject,
  mapConfig,
  dashboardProps,
}: MapComponentProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    savedObjects: { client: savedObjectsClient },
  } = services;
  const [layers, setLayers] = useState<MapLayerSpecification[]>([]);
  const [savedMapObject, setSavedMapObject] =
    useState<SimpleSavedObject<MapSavedObjectAttributes> | null>();
  const [layersIndexPatterns, setLayersIndexPatterns] = useState<IndexPattern[]>([]);
  const maplibreRef = useRef<Maplibre | null>(null);
  const [mapState, setMapState] = useState<MapState>(getInitialMapState());
  const [isUpdatingLayerRender, setIsUpdatingLayerRender] = useState(true);
  const isReadOnlyMode = !!dashboardProps;
  const mapContainerRef = useRef<MapsContainerHandle>(null);

  useEffect(() => {
    if (mapIdFromSavedObject) {
      savedObjectsClient.get<MapSavedObjectAttributes>('map', mapIdFromSavedObject).then((res) => {
        setSavedMapObject(res);
        const layerList: MapLayerSpecification[] = JSON.parse(res.attributes.layerList as string);
        const savedMapState: MapState = JSON.parse(res.attributes.mapState as string);
        setMapState(savedMapState);
        setLayers(layerList);
        const savedIndexPatterns: IndexPattern[] = [];
        layerList.forEach(async (layer: MapLayerSpecification) => {
          if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
            const indexPatternId = layer.source.indexPatternId;
            const indexPattern = await services.data.indexPatterns.get(indexPatternId);
            savedIndexPatterns.push(indexPattern);
          }
        });
        setLayersIndexPatterns(savedIndexPatterns);
      });
    } else {
      const initialDefaultLayer: MapLayerSpecification = getLayerConfigMap(mapConfig)[
        OPENSEARCH_MAP_LAYER.type
      ] as MapLayerSpecification;
      initialDefaultLayer.name = MAP_LAYER_DEFAULT_NAME;
      setLayers([initialDefaultLayer]);
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
      {isReadOnlyMode ? null : (
        <MapTopNavMenu
          mapIdFromUrl={mapIdFromSavedObject}
          savedMapObject={savedMapObject}
          layers={layers}
          layersIndexPatterns={layersIndexPatterns}
          maplibreRef={maplibreRef}
          mapState={mapState}
          setMapState={setMapState}
          setIsUpdatingLayerRender={setIsUpdatingLayerRender}
          mapContainerRef={mapContainerRef}
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
        mapConfig={mapConfig}
        isReadOnlyMode={isReadOnlyMode}
        dashboardProps={dashboardProps}
        isUpdatingLayerRender={isUpdatingLayerRender}
        setIsUpdatingLayerRender={setIsUpdatingLayerRender}
        addSpatialFilter={addSpatialFilter}
        ref={mapContainerRef}
      />
    </div>
  );
};

export const MapPage = ({ mapConfig }: MapPageProps) => {
  const { id: mapId } = useParams<{ id: string }>();
  return <MapComponent mapIdFromSavedObject={mapId} mapConfig={mapConfig} />;
};
