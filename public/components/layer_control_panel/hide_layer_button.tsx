/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButtonIcon, EuiFlexItem } from '@elastic/eui';
import React, { useState } from 'react';
import {
  LAYER_PANEL_HIDE_LAYER_ICON,
  LAYER_PANEL_SHOW_LAYER_ICON,
  LAYER_VISIBILITY,
} from '../../../common';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { updateLayerVisibilityHandler } from '../../model/map/layer_operations';
import { MaplibreRef } from '../../model/layersFunctions';

interface HideLayerProps {
  layer: MapLayerSpecification;
  maplibreRef: MaplibreRef;
  updateLayerVisibility: (layerId: string, visibility: string) => void;
}

export const HideLayer = ({ layer, maplibreRef, updateLayerVisibility }: HideLayerProps) => {
  const [layerVisibility, setLayerVisibility] = useState(
    new Map<string, boolean>([[layer.id, layer.visibility === LAYER_VISIBILITY.VISIBLE]])
  );

  const onLayerVisibilityChange = () => {
    let updatedVisibility: string;
    if (layer.visibility === LAYER_VISIBILITY.VISIBLE) {
      updatedVisibility = LAYER_VISIBILITY.NONE;
    } else {
      updatedVisibility = LAYER_VISIBILITY.VISIBLE;
    }
    setLayerVisibility(
      new Map(layerVisibility.set(layer.id, updatedVisibility === LAYER_VISIBILITY.VISIBLE))
    );
    updateLayerVisibility(layer.id, updatedVisibility);
    updateLayerVisibilityHandler(maplibreRef.current!, layer.id, updatedVisibility);
  };

  return (
    <EuiFlexItem grow={false} className="layerControlPanel__layerFunctionButton">
      <EuiButtonIcon
        iconType={
          layerVisibility.get(layer.id) ? LAYER_PANEL_HIDE_LAYER_ICON : LAYER_PANEL_SHOW_LAYER_ICON
        }
        size="s"
        onClick={onLayerVisibilityChange}
        aria-label="Hide or show layer"
        color="text"
        title={layerVisibility.get(layer.id) ? 'Hide layer' : 'Show layer'}
      />
    </EuiFlexItem>
  );
};
