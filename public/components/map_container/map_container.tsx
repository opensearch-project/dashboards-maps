/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Map as Maplibre, NavigationControl } from 'maplibre-gl';
import { debounce, throttle } from 'lodash';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { DrawFilterProperties, FILTER_DRAW_MODE, MAP_INITIAL_STATE } from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { DrawFilterShape } from '../toolbar/spatial_filter/draw_filter_shape';
import {
  Filter,
  IndexPattern,
  Query,
  RefreshInterval,
  TimeRange,
} from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import {
  renderDataLayers,
  renderBaseLayers,
  handleDataLayerRender,
  handleBaseLayerRender,
} from '../../model/layerRenderController';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { ResizeChecker } from '../../../../../src/plugins/opensearch_dashboards_utils/public';
import { MapServices } from '../../types';
import { ConfigSchema } from '../../../common/config';
import { baseLayerTypeLookup } from '../../model/layersFunctions';
import { MapsFooter } from './maps_footer';
import { DisplayFeatures } from '../tooltip/display_features';
import { TOOLTIP_STATE } from '../../../common';
import { SpatialFilterToolbar } from '../toolbar/spatial_filter/filter_toolbar';
import { DrawTooltip } from '../toolbar/spatial_filter/draw_tooltip';

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
  const [selectedLayerConfig, setSelectedLayerConfig] = useState<
    MapLayerSpecification | undefined
  >();
  // start with display feature
  const [tooltipState, setTooltipState] = useState<TOOLTIP_STATE>(TOOLTIP_STATE.DISPLAY_FEATURES);
  const [filterProperties, setFilterProperties] = useState<DrawFilterProperties>({
    mode: FILTER_DRAW_MODE.NONE,
  });

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

  // Handle map bounding box change, it should update the search if "request data around map extent" was enabled
  useEffect(() => {
    // Rerender layers with 200ms debounce to avoid calling the search API too frequently, especially when
    // resizing the window, the "moveend" event could be fired constantly
    const debouncedRenderLayers = debounce(() => {
      renderDataLayers(layers, mapState, services, maplibreRef, timeRange, filters, query);
    }, 200);

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
        renderDataLayers(layers, mapState, services, maplibreRef, timeRange, filters, query);
      }, refreshConfig.value);
    }
    return () => clearInterval(intervalId);
  }, [refreshConfig]);

  useEffect(() => {
    if (!mounted || layers.length <= 0) {
      return;
    }

    if (isUpdatingLayerRender || isReadOnlyMode) {
      if (selectedLayerConfig) {
        if (baseLayerTypeLookup[selectedLayerConfig.type]) {
          handleBaseLayerRender(selectedLayerConfig, maplibreRef, undefined);
        } else {
          updateIndexPatterns();
          handleDataLayerRender(selectedLayerConfig, mapState, services, maplibreRef, undefined);
        }
      } else {
        renderDataLayers(layers, mapState, services, maplibreRef, timeRange, filters, query);
        renderBaseLayers(layers, maplibreRef);
      }
      setIsUpdatingLayerRender(false);
    }
  }, [layers, mounted, timeRange, filters, query, mapState, isReadOnlyMode]);

  useEffect(() => {
    const currentTooltipState: TOOLTIP_STATE =
      filterProperties?.mode === FILTER_DRAW_MODE.NONE
        ? TOOLTIP_STATE.DISPLAY_FEATURES
        : TOOLTIP_STATE.FILTER_DRAW_SHAPE;
    setTooltipState(currentTooltipState);
  }, [filterProperties]);

  const updateIndexPatterns = async () => {
    if (!selectedLayerConfig) {
      return;
    }
    if (baseLayerTypeLookup[selectedLayerConfig.type]) {
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
      {mounted && <MapsFooter map={maplibreRef.current!} zoom={zoom} />}
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
      {mounted && tooltipState === TOOLTIP_STATE.DISPLAY_FEATURES && (
        <DisplayFeatures map={maplibreRef.current!} layers={layers} />
      )}
      {mounted && Boolean(maplibreRef.current) && (
        <DrawTooltip map={maplibreRef.current!} mode={filterProperties.mode} />
      )}
      {mounted && maplibreRef.current && tooltipState === TOOLTIP_STATE.FILTER_DRAW_SHAPE && (
        <DrawFilterShape
          map={maplibreRef.current}
          filterProperties={filterProperties}
          updateFilterProperties={setFilterProperties}
        />
      )}
      <div className="SpatialFilterToolbar-container">
        {mounted && (
          <SpatialFilterToolbar
            setFilterProperties={setFilterProperties}
            isDrawActive={filterProperties.mode !== FILTER_DRAW_MODE.NONE}
          />
        )}
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
