/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiPanel } from '@elastic/eui';
import React, { memo, useEffect, useState } from 'react';
import { LngLat, MapEventType } from 'maplibre-gl';
import { Map as Maplibre } from 'maplibre-gl';

const coordinatesRoundOffDigit = 4;
interface MapFooterProps {
  map: Maplibre;
  zoom: number;
}

export const MapsFooter = memo(({ map, zoom }: MapFooterProps) => {
  const [coordinates, setCoordinates] = useState<LngLat>();
  useEffect(() => {
    function onMouseMoveMap(e: MapEventType['mousemove']) {
      setCoordinates(e.lngLat.wrap());
    }

    if (map) {
      map.on('mousemove', onMouseMoveMap);
    }
    return () => {
      if (map) {
        map.off('mousemove', onMouseMoveMap);
      }
    };
  }, []);

  return (
    <EuiPanel
      hasShadow={false}
      hasBorder={false}
      color="transparent"
      className="zoombar"
      data-test-subj="mapStatusBar"
    >
      <small>
        {coordinates &&
          `lat: ${coordinates.lat.toFixed(
            coordinatesRoundOffDigit
          )}, lon: ${coordinates.lng.toFixed(coordinatesRoundOffDigit)}, `}
        zoom: {zoom}
      </small>
    </EuiPanel>
  );
});
