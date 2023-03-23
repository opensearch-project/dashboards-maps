/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment, useEffect, useRef } from 'react';
import { IControl, Map as Maplibre } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Feature } from 'geojson';
import {
  DrawFilterProperties,
  FILTER_DRAW_MODE,
  MAPBOX_GL_DRAW_MODES,
  MAPBOX_GL_DRAW_CREATE_LISTENER,
} from '../../../../common';
import { DrawRectangle } from '../../draw/modes/rectangle';

interface DrawFilterShapeProps {
  filterProperties: DrawFilterProperties;
  map: Maplibre;
  updateFilterProperties: (properties: DrawFilterProperties) => void;
}

function getMapboxDrawMode(mode: FILTER_DRAW_MODE): string {
  switch (mode) {
    case FILTER_DRAW_MODE.POLYGON:
      return MAPBOX_GL_DRAW_MODES.DRAW_POLYGON;
    case FILTER_DRAW_MODE.RECTANGLE:
      return MAPBOX_GL_DRAW_MODES.DRAW_RECTANGLE;
    default:
      return MAPBOX_GL_DRAW_MODES.SIMPLE_SELECT;
  }
}

export const DrawFilterShape = ({
  filterProperties,
  map,
  updateFilterProperties,
}: DrawFilterShapeProps) => {
  const onDraw = (event: { features: Feature[] }) => {
    updateFilterProperties({
      mode: FILTER_DRAW_MODE.NONE,
    });
  };
  const mapboxDrawRef = useRef<MapboxDraw>(
    new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        [MAPBOX_GL_DRAW_MODES.DRAW_RECTANGLE]: DrawRectangle,
      },
    })
  );

  useEffect(() => {
    if (map) {
      map.addControl((mapboxDrawRef.current as unknown) as IControl, 'top-right');
      map.on(MAPBOX_GL_DRAW_CREATE_LISTENER, onDraw);
    }
    return () => {
      if (map) {
        map.off(MAPBOX_GL_DRAW_CREATE_LISTENER, onDraw);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeControl((mapboxDrawRef.current as unknown) as IControl);
      }
    };
  }, []);

  useEffect(() => {
    const mapboxDrawMode: string = getMapboxDrawMode(filterProperties.mode);
    mapboxDrawRef.current.changeMode(mapboxDrawMode);
  }, [filterProperties.mode]);

  return <Fragment />;
};
