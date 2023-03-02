/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { LngLat, Map as Maplibre, NavigationControl, Popup, MapEventType } from 'maplibre-gl';
import { debounce, throttle } from 'lodash';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { MAP_INITIAL_STATE, DASHBOARDS_MAPS_LAYER_TYPE } from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import {
  IndexPattern,
  RefreshInterval,
  TimeRange,
  Filter,
  Query,
} from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import { createPopup, getPopupLocation, isTooltipEnabledLayer } from '../tooltip/create_tooltip';
import {
  handleDataLayerRender,
  handleReferenceLayerRender,
} from '../../model/layerRenderController';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { ResizeChecker } from '../../../../../src/plugins/opensearch_dashboards_utils/public';
import { MapServices } from '../../types';
import { ConfigSchema } from '../../../common/config';
import {
  getDataLayers,
  getMapBeforeLayerId,
  getReferenceLayers,
  referenceLayerTypeLookup,
} from '../../model/layersFunctions';
import { MapsFooter } from './mapsFooter';

interface MapContainerProps {
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
  layersIndexPatterns: IndexPattern[];
  setLayersIndexPatterns: (indexPatterns: IndexPattern[]) => void;
  maplibreRef: React.MutableRefObject<Maplibre | null>;
  mapState: MapState;
  mapConfig: ConfigSchema;
  isReadOnlyMode: boolean;
  timeRange?: TimeRange;
  refreshConfig?: RefreshInterval;
  filters?: Filter[];
  query?: Query;
  isUpdatingLayerRender: boolean;
  setIsUpdatingLayerRender: (isUpdatingLayerRender: boolean) => void;
}

export const MapContainer = ({
  setLayers,
  layers,
  layersIndexPatterns,
  setLayersIndexPatterns,
  maplibreRef,
  mapState,
  mapConfig,
  isReadOnlyMode,
  timeRange,
  refreshConfig,
  filters,
  query,
  isUpdatingLayerRender,
  setIsUpdatingLayerRender,
}: MapContainerProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const mapContainer = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState<number>(MAP_INITIAL_STATE.zoom);
  const [coordinates, setCoordinates] = useState<LngLat>();
  const [selectedLayerConfig, setSelectedLayerConfig] = useState<
    MapLayerSpecification | undefined
  >();

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

    // By default, Maplibre only auto resize map window when browser size changes, but in dashboard mode, we need
    // manually resize map window size when map panel size changes
    const mapContainerElement: HTMLElement | null = document.querySelector('.map-page');
    let resizeChecker: ResizeChecker;
    if (mapContainerElement) {
      resizeChecker = new ResizeChecker(mapContainerElement);
      if (isReadOnlyMode) {
        resizeChecker.on(
          'resize',
          throttle(() => {
            maplibreInstance?.resize();
          }, 300)
        );
      }
    }
    return () => {
      maplibreInstance.remove();
      if (resizeChecker) {
        resizeChecker.destroy();
      }
    };
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
          // enable close button to avoid occasional dangling tooltip that is not cleared during mouse leave action
          showCloseButton: true,
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

  // Update data layers when state bar enable auto refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (refreshConfig && !refreshConfig.pause) {
      intervalId = setInterval(() => {
        layers.forEach((layer: MapLayerSpecification) => {
          if (referenceLayerTypeLookup[layer.type]) {
            return;
          }
          handleDataLayerRender(layer, mapState, services, maplibreRef, undefined, timeRange);
        });
      }, refreshConfig.value);
    }
    return () => clearInterval(intervalId);
  }, [refreshConfig]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (layers.length <= 0) {
      return;
    }

    if (isUpdatingLayerRender || isReadOnlyMode) {
      if (selectedLayerConfig) {
        if (referenceLayerTypeLookup[selectedLayerConfig.type]) {
          handleReferenceLayerRender(selectedLayerConfig, maplibreRef, undefined);
        } else {
          updateIndexPatterns();
          handleDataLayerRender(selectedLayerConfig, mapState, services, maplibreRef, undefined);
        }
      } else {
        getDataLayers(layers).forEach((layer: MapLayerSpecification) => {
          const beforeLayerId = getMapBeforeLayerId(layers, layer.id);
          handleDataLayerRender(
            layer,
            mapState,
            services,
            maplibreRef,
            beforeLayerId,
            timeRange,
            filters,
            query
          );
        });
        getReferenceLayers(layers).forEach((layer: MapLayerSpecification) => {
          const beforeLayerId = getMapBeforeLayerId(layers, layer.id);
          handleReferenceLayerRender(layer, maplibreRef, beforeLayerId);
        });
      }
      setIsUpdatingLayerRender(false);
    }
  }, [layers, mounted, timeRange, filters, query, mapState, isReadOnlyMode]);

  const updateIndexPatterns = async () => {
    if (!selectedLayerConfig) {
      return;
    }
    if (referenceLayerTypeLookup[selectedLayerConfig.type]) {
      return;
    }
    const findIndexPattern = layersIndexPatterns.find(
      // @ts-ignore
      (indexPattern) => indexPattern.id === selectedLayerConfig.source.indexPatternId
    );
    if (!findIndexPattern) {
      // @ts-ignore
      const newIndexPattern = await indexPatterns.get(selectedLayerConfig.source.indexPatternId);
      const cloneLayersIndexPatterns = [...layersIndexPatterns, newIndexPattern];
      setLayersIndexPatterns(cloneLayersIndexPatterns);
    }
  };

  return (
    <div className="map-main">
      <MapsFooter coordinates={coordinates} zoom={zoom} />
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
          isReadOnlyMode={isReadOnlyMode}
          selectedLayerConfig={selectedLayerConfig}
          setSelectedLayerConfig={setSelectedLayerConfig}
          setIsUpdatingLayerRender={setIsUpdatingLayerRender}
        />
      )}
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
