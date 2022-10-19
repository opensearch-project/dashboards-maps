/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Map as Maplibre, NavigationControl } from 'maplibre-gl';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_VECTOR_TILE_URL, MAP_INITIAL_STATE } from '../../../common/index';

export const MapContainer = () => {
  const maplibreRef = useRef<Maplibre | null>(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    const mapStyle = MAP_VECTOR_TILE_URL;
    const initialState = MAP_INITIAL_STATE;

    const maplibre = new Maplibre({
      // @ts-ignore
      container: mapContainer.current,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    maplibre.setStyle(mapStyle);
    maplibreRef.current = maplibre;
    maplibre.addControl(new NavigationControl({ showCompass: false }), 'top-right');
  }, []);

  return (
    <div>
      <div className="layerControlPanel-container">
        <LayerControlPanel maplibreRef={maplibreRef} />
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
