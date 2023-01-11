/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleSavedObject } from 'opensearch-dashboards/public';
import { Map as Maplibre } from 'maplibre-gl';
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
import { getLayerConfigMap, getInitialMapState } from '../../utils/getIntialConfig';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import { ConfigSchema } from '../../config';

interface Props {
  mapConfig: ConfigSchema;
}

export const MapPage = ({ mapConfig }: Props) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    savedObjects: { client: savedObjectsClient },
  } = services;
  const [layers, setLayers] = useState<MapLayerSpecification[]>([]);
  const { id: mapIdFromUrl } = useParams<{ id: string }>();
  const [savedMapObject, setSavedMapObject] =
    useState<SimpleSavedObject<MapSavedObjectAttributes> | null>();
  const [layersIndexPatterns, setLayersIndexPatterns] = useState<IndexPattern[]>([]);
  const maplibreRef = useRef<Maplibre | null>(null);
  const [mapState, setMapState] = useState<MapState>(getInitialMapState());

  useEffect(() => {
    if (mapIdFromUrl) {
      savedObjectsClient.get<MapSavedObjectAttributes>('map', mapIdFromUrl).then((res) => {
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
      ];
      initialDefaultLayer.name = MAP_LAYER_DEFAULT_NAME;
      setLayers([initialDefaultLayer]);
    }
  }, []);

  return (
    <div>
      <MapTopNavMenu
        mapIdFromUrl={mapIdFromUrl}
        savedMapObject={savedMapObject}
        layers={layers}
        layersIndexPatterns={layersIndexPatterns}
        maplibreRef={maplibreRef}
        mapState={mapState}
        setMapState={setMapState}
      />
      <MapContainer
        layers={layers}
        setLayers={setLayers}
        layersIndexPatterns={layersIndexPatterns}
        setLayersIndexPatterns={setLayersIndexPatterns}
        maplibreRef={maplibreRef}
        mapState={mapState}
        mapConfig={mapConfig}
      />
    </div>
  );
};
