/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { EuiPanel } from '@elastic/eui';
import { Map as Maplibre, NavigationControl } from 'maplibre-gl';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_INITIAL_STATE, MAP_GLYPHS, MAP_VECTOR_TILE_DATA_SOURCE } from '../../../common';

export const MapContainer = () => {
  const maplibreRef = useRef<Maplibre | null>(null);
  const mapContainer = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(MAP_INITIAL_STATE.zoom);

  useEffect(() => {
    const mbStyle = {
      version: 8 as 8,
      sources: {},
      layers: [],
      glyphs: MAP_GLYPHS,
    };

    maplibreRef.current = new Maplibre({
      // @ts-ignore
      container: mapContainer.current,
      center: [MAP_INITIAL_STATE.lng, MAP_INITIAL_STATE.lat],
      zoom,
      style: mbStyle,
    });

    maplibreRef.current.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    maplibreRef.current.on('style.load', function () {
      // @ts-ignore
      maplibreRef.current.addSource('openmaptiles', {
        type: 'vector',
        url: MAP_VECTOR_TILE_DATA_SOURCE,
      });
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    // @ts-ignore
    maplibreRef.current.on('move', () => {
      // @ts-ignore
      return setZoom(maplibreRef.current.getZoom().toFixed(2));
    });
  }, [zoom]);

  useEffect(() => {}, []);

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
