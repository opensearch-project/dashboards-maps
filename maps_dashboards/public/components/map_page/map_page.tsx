/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleSavedObject } from 'opensearch-dashboards/public';
import { v4 as uuidv4 } from 'uuid';
import { MapContainer } from '../map_container';
import { MapTopNavMenu } from '../map_top_nav';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { MapServices } from '../../types';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import {
  DASHBOARDS_MAPS_LAYER_NAME,
  DASHBOARDS_MAPS_LAYER_TYPE,
  LAYER_VISIBILITY,
  MAP_DEFAULT_MAX_ZOOM,
  MAP_DEFAULT_MIN_ZOOM,
  MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
  MAP_VECTOR_TILE_BASIC_STYLE,
  MAP_VECTOR_TILE_DATA_SOURCE,
} from '../../../common';

export const MapPage = () => {
  const [layers, setLayers] = useState<MapLayerSpecification[]>([]);
  const { id: mapIdFromUrl } = useParams<{ id: string }>();
  const [savedMapObject, setSavedMapObject] =
    useState<SimpleSavedObject<MapSavedObjectAttributes> | null>();
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    savedObjects: { client: savedObjectsClient },
  } = services;

  const initialDefaultLayer: MapLayerSpecification = {
    id: uuidv4(),
    type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
    name: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
    zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
    opacity: MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
    visibility: LAYER_VISIBILITY.VISIBLE,
    source: {
      dataURL: MAP_VECTOR_TILE_DATA_SOURCE,
    },
    style: {
      styleURL: MAP_VECTOR_TILE_BASIC_STYLE,
    },
  };

  useEffect(() => {
    if (mapIdFromUrl) {
      savedObjectsClient.get<MapSavedObjectAttributes>('map', mapIdFromUrl).then((res) => {
        setSavedMapObject(res);
        setLayers(JSON.parse(res.attributes.layerList as string));
      });
    } else {
      setLayers([initialDefaultLayer]);
    }
  }, []);

  return (
    <div>
      <MapTopNavMenu mapIdFromUrl={mapIdFromUrl} savedMapObject={savedMapObject} layers={layers} />
      <MapContainer mapIdFromUrl={mapIdFromUrl} layers={layers} setLayers={setLayers} />
    </div>
  );
};
