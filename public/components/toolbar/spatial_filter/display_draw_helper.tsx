/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import React, { memo, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { Map as Maplibre } from 'maplibre-gl';
import { FILTER_DRAW_MODE } from '../../../../common';

interface DrawFilterShapeHelper {
  map: Maplibre;
  mode: FILTER_DRAW_MODE;
  onCancel: () => void;
}

const getHelpText = (mode: FILTER_DRAW_MODE): string => {
  switch (mode) {
    case FILTER_DRAW_MODE.POLYGON:
      return i18n.translate('maps.drawFilterPolygon.tooltipContent', {
        defaultMessage: 'Click to start shape. Click for vertex. Double click to finish.',
      });
    case FILTER_DRAW_MODE.RECTANGLE:
      return i18n.translate('maps.drawFilterRectangle.tooltipContent', {
        defaultMessage: 'Click to start rectangle. Move mouse to adjust size. Click to finish.',
      });
    default:
      return i18n.translate('maps.drawFilterDefault.tooltipContent', {
        defaultMessage: 'Click to start shape. Double click to finish.',
      });
  }
};
export const DrawFilterShapeHelper = memo(({ map, mode, onCancel }: DrawFilterShapeHelper) => {
  useEffect(() => {
    if (map && mode !== FILTER_DRAW_MODE.NONE) {
      map.getCanvas().style.cursor = 'crosshair'; // Changes cursor to '+'
    } else {
      map.getCanvas().style.cursor = '';
    }
  }, [mode]);

  return mode === FILTER_DRAW_MODE.NONE ? null : (
    <EuiPanel
      color="plain"
      className="drawFilterShapeHelper"
      data-test-subj="drawFilterShapeHelper"
      paddingSize={'s'}
    >
      <EuiFlexGroup gutterSize="m" alignItems="center">
        <EuiFlexItem grow={false}>
          <small>{getHelpText(mode)}</small>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton fill onClick={onCancel} size={'s'}>
            {'Cancel'}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
});
