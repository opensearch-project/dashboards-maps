/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map as Maplibre, MapEventType, Popup } from 'maplibre-gl';
import React, { memo, useEffect, Fragment } from 'react';
import {
  createPopup,
  getPopupLocation,
  isTooltipEnabledLayer,
  isTooltipEnabledOnHover,
} from './create_tooltip';
import { MapLayerSpecification } from '../../model/mapLayerType';

interface Props {
  map: Maplibre;
  layers: MapLayerSpecification[];
}

export const DisplayFeatures = memo(({ map, layers }: Props) => {
  useEffect(() => {
    let clickPopup: Popup | null = null;
    let hoverPopup: Popup | null = null;

    // We don't want to show layer information in the popup for the map tile layer
    const tooltipEnabledLayers = layers.filter(isTooltipEnabledLayer);

    function onClickMap(e: MapEventType['click']) {
      // remove previous popup
      clickPopup?.remove();

      const features = map.queryRenderedFeatures(e.point);
      if (features && map) {
        clickPopup = createPopup({ features, layers: tooltipEnabledLayers });
        clickPopup?.setLngLat(getPopupLocation(features[0].geometry, e.lngLat)).addTo(map);
      }
    }

    function onMouseMoveMap(e: MapEventType['mousemove']) {
      // remove previous popup
      hoverPopup?.remove();

      const tooltipEnabledLayersOnHover = layers.filter(isTooltipEnabledOnHover);
      const features = map.queryRenderedFeatures(e.point);
      if (features && map) {
        hoverPopup = createPopup({
          features,
          layers: tooltipEnabledLayersOnHover,
          // enable close button to avoid occasional dangling tooltip that is not cleared during mouse leave action
          showCloseButton: true,
          showPagination: false,
          showLayerSelection: false,
        });
        hoverPopup?.setLngLat(getPopupLocation(features[0].geometry, e.lngLat)).addTo(map);
      }
    }

    if (map) {
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
      if (map) {
        map.off('click', onClickMap);
        map.off('mousemove', onMouseMoveMap);
      }
    };
  }, [layers]);

  return <Fragment />;
});
