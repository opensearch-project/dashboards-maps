/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { EuiPanel } from '@elastic/eui';
import { LngLat, Map as Maplibre, MapMouseEvent, NavigationControl, Popup } from 'maplibre-gl';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_INITIAL_STATE, MAP_GLYPHS } from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import { createPopup, getPopupLngLat, isTooltipEnabledLayer } from '../tooltip/create_tooltip';

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
  const [coordinates, setCoordinates] = useState<LngLat>();

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
    maplibreInstance.addControl(new NavigationControl({ showCompass: true }), 'top-right');
    maplibreInstance.on('style.load', function () {
      setMounted(true);
    });
    maplibreInstance.on('move', () => {
      return setZoom(Number(maplibreInstance.getZoom().toFixed(2)));
    });
  }, []);

  useEffect(() => {
    let clickPopup: Popup | null = null;
    let hoverPopup: Popup | null = null;

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

    function onMouseMoveMap(e: MapMouseEvent) {
      setCoordinates(e.lngLat.wrap());

      // remove previous popup
      hoverPopup?.remove();

      const features = maplibreRef.current?.queryRenderedFeatures(e.point);
      if (features && maplibreRef.current) {
        hoverPopup = createPopup({
          features,
          layers: tooltipEnabledLayers,
          showCloseButton: false,
          showPagination: false,
          showLayerSelection: false,
        });
        hoverPopup
          ?.setLngLat(getPopupLngLat(features[0].geometry) ?? e.lngLat)
          .addTo(maplibreRef.current);
      }
    }

    if (maplibreRef.current) {
      const map = maplibreRef.current;
      map.on('click', onClickMap);
      // reset cursor to default when user is no longer hovering over a clickable feature
      map.on('mouseleave', () => {
        map.getCanvas().style.cursor = '';
        hoverPopup?.remove();
      });
      map.on('mouseenter', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      // add tooltip when users mouse move over a point
      map.on('mousemove', onMouseMoveMap);
    }

    return () => {
      if (maplibreRef.current) {
        maplibreRef.current.off('click', onClickMap);
        maplibreRef.current.off('mousemove', onMouseMoveMap);
      }
    };
  }, [layers]);

  return (
    <div>
      <EuiPanel hasShadow={false} hasBorder={false} color="transparent" className="zoombar">
        <small>
          {coordinates &&
            `lat: ${coordinates.lat.toFixed(4)}, lon: ${coordinates.lng.toFixed(4)}, `}
          zoom: {zoom}
        </small>
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
