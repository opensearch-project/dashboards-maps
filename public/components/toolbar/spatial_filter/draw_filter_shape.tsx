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

interface DrawFilterShapeProps {
  filterProperties: DrawFilterProperties;
  map: Maplibre;
  updateFilterProperties: (properties: DrawFilterProperties) => void;
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
    if (filterProperties.mode === FILTER_DRAW_MODE.POLYGON) {
      mapboxDrawRef.current.changeMode(MAPBOX_GL_DRAW_MODES.DRAW_POLYGON);
    } else {
      // default mode
      mapboxDrawRef.current.changeMode(MAPBOX_GL_DRAW_MODES.SIMPLE_SELECT);
    }
  }, [filterProperties.mode]);

  return <Fragment />;
};
