/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import maplibregl, { Map as Maplibre, MapEventType, Popup } from 'maplibre-gl';
import React, { Fragment, useEffect, useRef } from 'react';
import { i18n } from '@osd/i18n';
import { FILTER_DRAW_MODE } from '../../../../common';
import { isEscapeKey } from '../../../../common/util';

interface Props {
  map: Maplibre;
  mode: FILTER_DRAW_MODE;
  onCancel: () => void;
}

const X_AXIS_GAP_BETWEEN_CURSOR_AND_POPUP = -12;
const Y_AXIS_GAP_BETWEEN_CURSOR_AND_POPUP = 0;
const KEY_UP_EVENT_TYPE = 'keyup';
const MOUSE_MOVE_EVENT_TYPE = 'mousemove';
const MOUSE_OUT_EVENT_TYPE = 'mouseout';

const getTooltipContent = (mode: FILTER_DRAW_MODE): string => {
  switch (mode) {
    case FILTER_DRAW_MODE.POLYGON:
      return i18n.translate('maps.drawFilterPolygon.tooltipContent', {
        defaultMessage:
          'Click to start shape. Click for vertex. Double click to finish, [esc] to cancel',
      });
    case FILTER_DRAW_MODE.RECTANGLE:
      return i18n.translate('maps.drawFilterRectangle.tooltipContent', {
        defaultMessage: 'Click and drag to draw rectangle, [esc] to cancel',
      });
    default:
      return i18n.translate('maps.drawFilterDefault.tooltipContent', {
        defaultMessage: 'Click to start shape. Double click to finish, [esc] to cancel',
      });
  }
};

export const DrawTooltip = ({ map, mode, onCancel }: Props) => {
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
    function onMouseMove(e: MapEventType['mousemove']) {
      map.getCanvas().style.cursor = 'crosshair'; // Changes cursor to '+'
      hoverPopupRef.current
        .setLngLat(e.lngLat)
        .setOffset([X_AXIS_GAP_BETWEEN_CURSOR_AND_POPUP, Y_AXIS_GAP_BETWEEN_CURSOR_AND_POPUP]) // add some gap between cursor and pop up
        .setText(getTooltipContent(mode))
        .addTo(map);
    }

    function onMouseOut() {
      hoverPopupRef.current.remove();
    }

    function onKeyUp(e: KeyboardEvent) {
      if (isEscapeKey(e)) {
        onCancel();
      }
    }

    function resetAction() {
      map.getCanvas().style.cursor = '';
      hoverPopupRef.current.remove();
      // remove tooltip when users mouse move over a point
      map.off(MOUSE_MOVE_EVENT_TYPE, onMouseMove);
      map.off(MOUSE_OUT_EVENT_TYPE, onMouseOut);
      map.getContainer().removeEventListener(KEY_UP_EVENT_TYPE, onKeyUp);
    }

    if (map && mode === FILTER_DRAW_MODE.NONE) {
      resetAction();
    } else {
      // add tooltip when users mouse move over a point
      map.on(MOUSE_MOVE_EVENT_TYPE, onMouseMove);
      map.on(MOUSE_OUT_EVENT_TYPE, onMouseOut);
      map.getContainer().addEventListener(KEY_UP_EVENT_TYPE, onKeyUp);
    }
    return () => {
      // remove tooltip when users mouse move over a point
      // when component is unmounted
      resetAction();
    };
  }, [mode]);

  return <Fragment />;
};
