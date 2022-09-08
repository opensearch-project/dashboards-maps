/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { LayerControlPanel } from './layer_control_panel';

// Render layer panel on top of Maplibre
class MaplibreLayersPanelControl {
  private _container: HTMLElement | undefined;

  onAdd(map: any) {
    this._container = document.createElement('div');
    ReactDOM.render(<LayerControlPanel />, this._container);
    return this._container;
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}

export { MaplibreLayersPanelControl };
