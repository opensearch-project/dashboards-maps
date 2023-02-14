/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { EuiPanel } from '@elastic/eui';
import { LngLat, Map as Maplibre, NavigationControl, Popup, MapEventType } from 'maplibre-gl';
import { debounce } from 'lodash';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_INITIAL_STATE, DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import { createPopup, getPopupLocation, isTooltipEnabledLayer } from '../tooltip/create_tooltip';
import { handleDataLayerRender } from '../../model/layerRenderController';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { ConfigSchema } from '../../../common/config';

interface MapContainerProps {
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
  layersIndexPatterns: IndexPattern[];
  setLayersIndexPatterns: (indexPatterns: IndexPattern[]) => void;
  maplibreRef: React.MutableRefObject<Maplibre | null>;
  mapState: MapState;
  mapConfig: ConfigSchema;
}

export const MapContainer = ({
  setLayers,
  layers,
  layersIndexPatterns,
  setLayersIndexPatterns,
  maplibreRef,
  mapState,
  mapConfig,
}: MapContainerProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
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
      glyphs: mapConfig.opensearchVectorTileGlyphsUrl,
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

  // Create onClick tooltip for each layer features that has tooltip enabled
  useEffect(() => {
    let clickPopup: Popup | null = null;
    let hoverPopup: Popup | null = null;

    // We don't want to show layer information in the popup for the map tile layer
    const tooltipEnabledLayers = layers.filter(isTooltipEnabledLayer);

    function onClickMap(e: MapEventType['click']) {
      // remove previous popup
      clickPopup?.remove();

      const features = maplibreRef.current?.queryRenderedFeatures(e.point);
      if (features && maplibreRef.current) {
        clickPopup = createPopup({ features, layers: tooltipEnabledLayers });
        clickPopup
          ?.setLngLat(getPopupLocation(features[0].geometry, e.lngLat))
          .addTo(maplibreRef.current);
      }
    }

    function onMouseMoveMap(e: MapEventType['mousemove']) {
      // This is required to update coordinates on map only on mouse move
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
          ?.setLngLat(getPopupLocation(features[0].geometry, e.lngLat))
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

  // Handle map bounding box change, it should update the search if "request data around map extent" was enabled
  useEffect(() => {
    function renderLayers() {
      layers.forEach((layer: MapLayerSpecification) => {
        // We don't send search query if the layer doesn't have "request data around map extent" enabled
        if (
          layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS &&
          layer.source.useGeoBoundingBoxFilter
        ) {
          handleDataLayerRender(layer, mapState, services, maplibreRef, undefined);
        }
      });
    }

    // Rerender layers with 200ms debounce to avoid calling the search API too frequently, especially when
    // resizing the window, the "moveend" event could be fired constantly
    const debouncedRenderLayers = debounce(renderLayers, 200);

    if (maplibreRef.current) {
      maplibreRef.current.on('moveend', debouncedRenderLayers);
    }

    return () => {
      if (maplibreRef.current) {
        maplibreRef.current.off('moveend', debouncedRenderLayers);
      }
    };
  }, [layers, mapState, services]);

  return (
    <div>
      <EuiPanel
        hasShadow={false}
        hasBorder={false}
        color="transparent"
        className="zoombar"
        data-test-subj="mapStatusBar"
      >
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
            zoom={zoom}
            mapConfig={mapConfig}
          />
        )}
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
