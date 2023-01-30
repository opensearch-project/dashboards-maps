/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayerSpecification } from 'maplibre-gl';
import { MockLayer } from './layer';

export class MockMaplibreMap {
  private _styles: {
    layers: MockLayer[];
  };

  constructor(layers: MockLayer[]) {
    this._styles = {
      layers: new Array<MockLayer>(...layers),
    };
  }

  getLayer(id: string): MockLayer[] {
    return this._styles.layers.filter((layer) => (layer.getProperty('id') as string).includes(id));
  }

  getStyle(): { layers: LayerSpecification[] } {
    const layerSpecs: LayerSpecification[] = this._styles.layers.map((layer) => {
      return {
        id: String(layer.getProperty('id')),
      } as LayerSpecification;
    });
    return {
      layers: layerSpecs,
    };
  }

  public setLayerZoomRange(layerId: string, minZoom: number, maxZoom: number) {
    this.setProperty(layerId, 'minZoom', minZoom);
    this.setProperty(layerId, 'maxZoom', maxZoom);
  }

  public setLayoutProperty(layerId: string, property: string, value: any) {
    this.setProperty(layerId, property, value);
  }

  public setPaintProperty(layerId: string, property: string, value: any) {
    this.setProperty(layerId, property, value);
  }

  public setProperty(layerId: string, property: string, value: any) {
    this.getLayer(layerId)?.forEach((layer) => {
      layer.setProperty(property, value);
    });
  }

  addLayer(layerSpec: LayerSpecification, beforeId?: string) {
    const layer: MockLayer = new MockLayer(layerSpec.id);
    Object.keys(layerSpec).forEach((key) => {
      // @ts-ignore
      layer.setProperty(key, layerSpec[key]);
    });
    if (!beforeId) {
      this._styles.layers.push(layer);
      return;
    }
    const beforeLayerIndex = this._styles.layers.findIndex((l) => {
      return l.getProperty('id') === beforeId;
    });
    this._styles.layers.splice(beforeLayerIndex, 0, layer);
  }
}
