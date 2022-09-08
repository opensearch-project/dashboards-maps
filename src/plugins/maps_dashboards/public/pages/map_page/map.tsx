/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Map as Maplibre } from 'maplibre-gl';
import { MaplibreLayersPanelControl } from '../../components/layer_control_panel';
import '../../index.scss';
import { MAP_VECTOR_TILE_URL, MAP_INITIAL_STATE } from '../../../common/index';

export const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const mapStyle = MAP_VECTOR_TILE_URL;

    const initialState = MAP_INITIAL_STATE;

    const map = new Maplibre({
      // @ts-ignore
      container: mapContainer.current,
      style: `${mapStyle}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    map.addControl(new MaplibreLayersPanelControl(), 'top-left');
  }, []);

  // render the map DOM
  return <div className="map-container" ref={mapContainer} />;
};
