/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayerSpecification } from 'maplibre-gl';
import { MockLayer } from './layer';

export type Source = any;

export class MockMaplibreMap {
  private _styles: {
    layers: MockLayer[];
    sources: Map<string, Source>;
  };

  constructor(layers: MockLayer[]) {
    this._styles = {
      layers: new Array<MockLayer>(...layers),
      sources: new Map<string, Source>(),
    };
  }

  public addSource(sourceId: string, source: Source) {
    this._styles.sources.set(sourceId, source);
  }

  public getSource(sourceId: string): string | undefined {
    return this._styles.sources.get(sourceId);
  }

  public removeSource(sourceId: string) {
    this._styles.sources.delete(sourceId);
  }

  public getLayers(): MockLayer[] {
    return [...this._styles.layers];
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

  private move(fromIndex: number, toIndex: number) {
    const element = this._styles.layers[fromIndex];
    this._styles.layers.splice(fromIndex, 1);
    this._styles.layers.splice(toIndex, 0, element);
  }

  moveLayer(layerId: string, beforeId?: string) {
    if (layerId === beforeId) {
      return;
    }
    const fromIndex: number = this._styles.layers.indexOf(this.getLayer(layerId)[0]);
    const toIndex: number = beforeId
      ? this._styles.layers.indexOf(this.getLayer(beforeId)[0])
      : this._styles.layers.length;
    this.move(fromIndex, toIndex);
  }

  removeLayer(layerId: string) {
    this._styles.layers = this.getLayers().filter(
      (layer) => !(layer.getProperty('id') as string).includes(layerId)
    );
  }
}
