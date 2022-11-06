/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleSavedObject } from 'opensearch-dashboards/public';
import { MapContainer } from '../map_container';
import { MapTopNavMenu } from '../map_top_nav';
import { ILayerConfig } from '../../model/ILayerConfig';
import { MapServices } from '../../types';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';

export const MapPage = () => {
  const [layers, setLayers] = useState<ILayerConfig[]>([]);
  const { id: mapIdFromUrl } = useParams<{ id: string }>();
  const [savedMapObject, setSavedMapObject] = useState<SimpleSavedObject<
    MapSavedObjectAttributes
  > | null>();
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
    }
  }, [savedObjectsClient, mapIdFromUrl]);

  return (
    <div>
      <MapTopNavMenu mapIdFromUrl={mapIdFromUrl} savedMapObject={savedMapObject} layers={layers} />
      <MapContainer mapIdFromUrl={mapIdFromUrl} layers={layers} setLayers={setLayers} />
    </div>
  );
};
