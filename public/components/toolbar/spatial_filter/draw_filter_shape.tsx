/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment, useEffect, useRef } from 'react';
import { IControl, Map as Maplibre } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Feature } from 'geojson';
import { DrawFilterProperties, FILTER_DRAW_MODE} from '../../../../common';

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
      map.addControl((mapboxDrawRef.current as unknown) as IControl);
      map.on('draw.create', onDraw);
    }
    return () => {
      if (map) {
        map.off('draw.create', onDraw);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeControl((mapboxDrawRef.current as unknown) as IControl);
      }
    };
  }, []);

  useEffect(() => {
    if (filterProperties.mode === FILTER_DRAW_MODE.POLYGON) {
      mapboxDrawRef.current.changeMode('draw_polygon');
    } else {
      // default mode
      mapboxDrawRef.current.changeMode('simple_select');
    }
  }, [filterProperties.mode]);

  return <Fragment />;
};
