/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleSavedObject } from 'opensearch-dashboards/public';
import { MapContainer } from '../map_container';
import { MapTopNavMenu } from '../map_top_nav';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { MapServices } from '../../types';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { OPENSEARCH_MAP_LAYER } from '../../../common';
import { getLayerConfigMap } from '../../utils/getIntialLayerConfig';

export const MapPage = () => {
  const [layers, setLayers] = useState<MapLayerSpecification[]>([]);
  const { id: mapIdFromUrl } = useParams<{ id: string }>();
  const [savedMapObject, setSavedMapObject] =
    useState<SimpleSavedObject<MapSavedObjectAttributes> | null>();
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    savedObjects: { client: savedObjectsClient },
  } = services;

  useEffect(() => {
    if (mapIdFromUrl) {
      savedObjectsClient.get<MapSavedObjectAttributes>('map', mapIdFromUrl).then((res) => {
        setSavedMapObject(res);
        setLayers(JSON.parse(res.attributes.layerList as string));
      });
    } else {
      const initialDefaultLayer: MapLayerSpecification =
        getLayerConfigMap()[OPENSEARCH_MAP_LAYER.type];
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
