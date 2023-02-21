/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Map as Maplibre } from 'maplibre-gl';
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
import { ConfigSchema } from '../../../common/config';

interface MapPageProps {
  mapConfig: ConfigSchema;
}

interface MapComponentProps {
  mapConfig: ConfigSchema;
  mapIdFromSavedObject: string;
  timeRange?: TimeRange;
  isReadOnlyMode: boolean;
  refreshConfig?: RefreshInterval;
  filters?: Filter[];
  query?: Query;
}
export const MapComponent = ({
  mapIdFromSavedObject,
  mapConfig,
  timeRange,
  isReadOnlyMode,
  refreshConfig,
  filters,
  query,
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
      const initialDefaultLayer: MapLayerSpecification =
        getLayerConfigMap(mapConfig)[OPENSEARCH_MAP_LAYER.type];
      initialDefaultLayer.name = MAP_LAYER_DEFAULT_NAME;
      setLayers([initialDefaultLayer]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map-page">
      {isReadOnlyMode ? null : (
        <MapTopNavMenu
          mapIdFromUrl={mapIdFromSavedObject}
          isReadOnlyMode={isReadOnlyMode}
          timeRange={timeRange}
          savedMapObject={savedMapObject}
          layers={layers}
          layersIndexPatterns={layersIndexPatterns}
          maplibreRef={maplibreRef}
          mapState={mapState}
          setMapState={setMapState}
          setIsUpdatingLayerRender={setIsUpdatingLayerRender}
        />
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
        timeRange={timeRange}
        refreshConfig={refreshConfig}
        filters={filters}
        query={query}
        isUpdatingLayerRender={isUpdatingLayerRender}
        setIsUpdatingLayerRender={setIsUpdatingLayerRender}
      />
    </div>
  );
};

export const MapPage = ({ mapConfig }: MapPageProps) => {
  const { id: mapId } = useParams<{ id: string }>();
  return <MapComponent mapIdFromSavedObject={mapId} mapConfig={mapConfig} isReadOnlyMode={false} />;
};
