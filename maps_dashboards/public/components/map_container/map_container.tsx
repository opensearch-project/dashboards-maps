/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  EuiPanel,
} from '@elastic/eui';
import { Map as Maplibre, NavigationControl } from 'maplibre-gl';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_VECTOR_TILE_URL, MAP_INITIAL_STATE } from '../../../common/index';

export const MapContainer = () => {
  const maplibreRef = useRef<Maplibre | null>(null);
  const mapContainer = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(MAP_INITIAL_STATE.zoom);

  useEffect(() => {
    const maplibre = new Maplibre({
      style: MAP_VECTOR_TILE_URL,
      container: mapContainer.current,
      center: [MAP_INITIAL_STATE.lng, MAP_INITIAL_STATE.lat],
      zoom: zoom
    });
    maplibre.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    maplibreRef.current = maplibre
    setMounted(true);
  }, []);

  useEffect(() => {
    maplibreRef.current.on('move', () => {
      setZoom(maplibreRef.current.getZoom().toFixed(2));
    });
  }, [zoom]);

  return (
    <div>
      <EuiPanel hasShadow={false} hasBorder={false} color="transparent" className="zoombar">
        <p> Zoom: {zoom} </p>
      </EuiPanel>
      <div className="layerControlPanel-container">
        {mounted && <LayerControlPanel maplibreRef={maplibreRef} />}
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
