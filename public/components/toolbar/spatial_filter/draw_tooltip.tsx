/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import maplibregl, { Map as Maplibre, MapEventType, Popup } from 'maplibre-gl';
import React, { Fragment, useEffect, useRef } from 'react';
import { i18n } from '@osd/i18n';
import { FILTER_DRAW_MODE } from '../../../../common';

interface Props {
  map: Maplibre;
  mode: FILTER_DRAW_MODE;
}

const gapBetweenCursorAndPopupOnXAxis: number = -12;

const getTooltipContent = (mode: FILTER_DRAW_MODE): string => {
  switch (mode) {
    case FILTER_DRAW_MODE.POLYGON:
      return i18n.translate('maps.drawFilterPolygon.tooltipContent', {
        defaultMessage: 'Click to start shape. Click for vertex. Double click to finish.',
      });
    default:
      return i18n.translate('maps.drawFilterDefault.tooltipContent', {
        defaultMessage: 'Click to start shape. Double click to finish.',
      });
  }
};

export const DrawTooltip = ({ map, mode }: Props) => {
  const hoverPopupRef = useRef<Popup>(
    new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: 'right',
      maxWidth: 'max-content',
    })
  );

  useEffect(() => {
    // remove previous popup
    function onMouseMoveMap(e: MapEventType['mousemove']) {
      map.getCanvas().style.cursor = 'crosshair'; // Changes cursor to '+'
      if (map) {
        hoverPopupRef.current
          .setLngLat(e.lngLat)
          .setOffset([gapBetweenCursorAndPopupOnXAxis, 0]) // add some gap between cursor and pop up
          .setText(getTooltipContent(mode))
          .addTo(map);
      }
    }

    map.on('mouseout', (ev) => {
      hoverPopupRef.current.remove();
    });

    if (map && mode === FILTER_DRAW_MODE.NONE) {
      map.getCanvas().style.cursor = '';
      hoverPopupRef?.current.remove();
      // remove tooltip when users mouse move over a point
      map.off('mousemove', onMouseMoveMap);
    } else {
      // add tooltip when users mouse move over a point
      map.on('mousemove', onMouseMoveMap);
    }
    return () => {
      if (map) {
        // remove tooltip when users mouse move over a point
        // when component is unmounted
        map.off('mousemove', onMouseMoveMap);
      }
    };
  }, [mode]);

  return <Fragment />;
};
