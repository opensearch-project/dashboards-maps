/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Map as Maplibre, NavigationControl } from 'maplibre-gl';
import { debounce, throttle } from 'lodash';
import { GeoShapeRelation } from '@opensearch-project/opensearch/api/types';
import { LayerControlPanel } from '../layer_control_panel';
import './map_container.scss';
import { DrawFilterProperties, FILTER_DRAW_MODE, MAP_INITIAL_STATE } from '../../../common';
import { DataLayerSpecification, MapLayerSpecification } from '../../model/mapLayerType';
import { DrawFilterShape } from '../toolbar/spatial_filter/draw_filter_shape';
import { IndexPattern } from '../../../../../src/plugins/data/public';
import { MapState } from '../../model/mapState';
import {
  renderDataLayers,
  renderBaseLayers,
  handleDataLayerRender,
  handleBaseLayerRender,
  orderLayers,
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
import { DrawFilterShapeHelper } from '../toolbar/spatial_filter/display_draw_helper';
import { ShapeFilter } from '../../../../../src/plugins/data/common';
import { DashboardProps } from '../map_page/map_page';
import { MapsServiceErrorMsg } from './maps_messages';
import { MapsLegend, MapsLegendHandle } from './legend';

interface MapContainerProps {
  setLayers: (layers: MapLayerSpecification[]) => void;
  layers: MapLayerSpecification[];
  layersIndexPatterns: IndexPattern[];
  setLayersIndexPatterns: (indexPatterns: IndexPattern[]) => void;
  maplibreRef: React.MutableRefObject<Maplibre | null>;
  mapState: MapState;
  mapConfig: ConfigSchema;
  isReadOnlyMode: boolean;
  dashboardProps?: DashboardProps;
  isUpdatingLayerRender: boolean;
  setIsUpdatingLayerRender: (isUpdatingLayerRender: boolean) => void;
  addSpatialFilter: (shape: ShapeFilter, label: string | null, relation: GeoShapeRelation) => void;
}

export class MapsServiceError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'MapsServiceError';
  }
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
  dashboardProps,
  isUpdatingLayerRender,
  setIsUpdatingLayerRender,
  addSpatialFilter,
}: MapContainerProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();

  function onError(e: unknown) {
    if (e instanceof MapsServiceError) {
      services.toastNotifications.addWarning(MapsServiceErrorMsg);
    }
  }

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
  const legendRef = useRef<MapsLegendHandle>(null);

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
      renderDataLayers(layers, mapState, services, maplibreRef, legendRef, dashboardProps);
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
    if (dashboardProps && dashboardProps.refreshConfig && !dashboardProps.refreshConfig.pause) {
      const { refreshConfig } = dashboardProps;
      intervalId = setInterval(() => {
        renderDataLayers(layers, mapState, services, maplibreRef, legendRef, dashboardProps);
      }, refreshConfig.value);
    }
    return () => clearInterval(intervalId);
  }, [dashboardProps?.refreshConfig]);

  // Update data layers when global filter is updated
  useEffect(() => {
    if (!mapState?.spatialMetaFilters) {
      return;
    }
    renderDataLayers(layers, mapState, services, maplibreRef, legendRef, dashboardProps);
  }, [mapState.spatialMetaFilters]);

  useEffect(() => {
    if (!mounted || layers.length <= 0) {
      return;
    }

    const orderLayersAfterRenderLoaded = () => orderLayers(layers, maplibreRef.current!);

    if (isUpdatingLayerRender || isReadOnlyMode) {
      if (selectedLayerConfig) {
        if (baseLayerTypeLookup[selectedLayerConfig.type]) {
          handleBaseLayerRender(selectedLayerConfig, maplibreRef, onError);
        } else {
          updateIndexPatterns();
          handleDataLayerRender(
            selectedLayerConfig as DataLayerSpecification,
            mapState,
            services,
            maplibreRef,
            legendRef
          );
        }
        setSelectedLayerConfig(undefined);
      } else {
        renderDataLayers(layers, mapState, services, maplibreRef, legendRef, dashboardProps);
        renderBaseLayers(layers, maplibreRef, onError);
        // Because of async layer rendering, layers order is not guaranteed, so we need to order layers
        // after all layers are rendered.
        maplibreRef.current!.once('idle', orderLayersAfterRenderLoaded);
      }
      setIsUpdatingLayerRender(false);
    }
    return () => {
      maplibreRef.current!.off('idle', orderLayersAfterRenderLoaded);
    };
  }, [
    layers,
    mounted,
    dashboardProps?.query,
    dashboardProps?.timeRange,
    dashboardProps?.filters,
    mapState,
    isReadOnlyMode,
  ]);

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
      {mounted && maplibreRef.current && <MapsFooter map={maplibreRef.current} zoom={zoom} />}
      {mounted && maplibreRef.current && <MapsLegend ref={legendRef} />}
      {mounted && maplibreRef.current && (
        <DrawFilterShapeHelper
          map={maplibreRef.current}
          mode={filterProperties.mode}
          onCancel={() => setFilterProperties({ mode: FILTER_DRAW_MODE.NONE })}
        />
      )}
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
          timeRange={dashboardProps?.timeRange}
          legendRef={legendRef}
        />
      )}
      {mounted && tooltipState === TOOLTIP_STATE.DISPLAY_FEATURES && maplibreRef.current && (
        <DisplayFeatures map={maplibreRef.current} layers={layers} />
      )}
      {mounted && maplibreRef.current && tooltipState === TOOLTIP_STATE.FILTER_DRAW_SHAPE && (
        <DrawFilterShape
          map={maplibreRef.current}
          filterProperties={filterProperties}
          updateFilterProperties={setFilterProperties}
          addSpatialFilter={addSpatialFilter}
        />
      )}
      <div className="SpatialFilterToolbar-container">
        {!isReadOnlyMode && mounted && (
          <SpatialFilterToolbar
            setFilterProperties={setFilterProperties}
            mode={filterProperties.mode}
          />
        )}
      </div>
      <div className="map-container" ref={mapContainer} />
    </div>
  );
};
