/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiPanel } from '@elastic/eui';
import { isEqual } from 'lodash';
import React, { memo } from 'react';
import { LngLat } from 'maplibre-gl';

const coordinatesRoundOffDigit = 4;
interface MapFooterProps {
  coordinates?: LngLat;
  zoom: number;
}

export const MapsFooter = memo(({ coordinates, zoom }: MapFooterProps) => {
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
}, isEqual);
