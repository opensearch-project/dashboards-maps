/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { EuiPanel } from '@elastic/eui';
import { Map as Maplibre, MapMouseEvent, NavigationControl, Popup } from 'maplibre-gl';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_INITIAL_STATE, MAP_GLYPHS } from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import { createPopup, getPopupLngLat, isTooltipEnabledLayer } from '../tooltip/create_tooltip';
import { DocumentLayerFunctions } from '../../model/documentLayerFunctions';

interface MapContainerProps {
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
  layersIndexPatterns: IndexPattern[];
  setLayersIndexPatterns: (indexPatterns: IndexPattern[]) => void;
  maplibreRef: React.MutableRefObject<Maplibre | null>;
  mapState: MapState;
}

export const MapContainer = ({
  setLayers,
  layers,
  layersIndexPatterns,
  setLayersIndexPatterns,
  maplibreRef,
  mapState,
}: MapContainerProps) => {
  const mapContainer = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState<number>(MAP_INITIAL_STATE.zoom);

  useEffect(() => {
    if (!mapContainer.current) return;
    const mbStyle = {
      version: 8 as 8,
      sources: {},
      layers: [],
      glyphs: MAP_GLYPHS,
    };

    maplibreRef.current = new Maplibre({
      container: mapContainer.current!,
      center: [MAP_INITIAL_STATE.lng, MAP_INITIAL_STATE.lat],
      zoom,
      style: mbStyle,
    });

    const maplibreInstance = maplibreRef.current!;
    maplibreInstance.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    maplibreInstance.on('style.load', function () {
      setMounted(true);
    });
    maplibreInstance.on('move', () => {
      return setZoom(Number(maplibreInstance.getZoom().toFixed(2)));
    });
  }, []);

  useEffect(() => {
    let clickPopup: Popup | null = null;

    // We don't want to show layer information in the popup for the map tile layer
    const tooltipEnabledLayers = layers.filter(isTooltipEnabledLayer);

    function onClickMap(e: MapMouseEvent) {
      // remove previous popup
      clickPopup?.remove();

      const features = maplibreRef.current?.queryRenderedFeatures(e.point);
      if (features && maplibreRef.current) {
        clickPopup = createPopup({ features, layers: tooltipEnabledLayers });
        clickPopup
          ?.setLngLat(getPopupLngLat(features[0].geometry) ?? e.lngLat)
          .addTo(maplibreRef.current);
      }
    }

    if (maplibreRef.current) {
      maplibreRef.current.on('click', onClickMap);
      for (const layer of tooltipEnabledLayers) {
        DocumentLayerFunctions.addTooltip(maplibreRef.current, layer);
      }
    }

    return () => {
      if (maplibreRef.current) {
        maplibreRef.current.off('click', onClickMap);
      }
    };
  }, [layers]);

  return (
    <div>
      <EuiPanel hasShadow={false} hasBorder={false} color="transparent" className="zoombar">
        <p> Zoom: {zoom} </p>
      </EuiPanel>
      <div className="layerControlPanel-container">
        {mounted && (
          <LayerControlPanel
            maplibreRef={maplibreRef}
            layers={layers}
            setLayers={setLayers}
            layersIndexPatterns={layersIndexPatterns}
            setLayersIndexPatterns={setLayersIndexPatterns}
            mapState={mapState}
          />
        )}
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
