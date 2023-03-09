/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export class MockLayer {
  private layerProperties: Map<string, any> = new Map<string, any>();

  constructor(id: string) {
    this.layerProperties.set('id', id);
  }

  public setProperty(name: string, value: any): this {
    if (Array.isArray(value) && value.length !== 0 && value[0] === 'get') {
      this.layerProperties.set(name, value[1]);
      return this;
    }
    this.layerProperties.set(name, value);
    return this;
  }

  public getProperty(name: string): any {
    return this.layerProperties.get(name);
  }

  public hasProperty(name: string): boolean {
    return this.layerProperties.has(name);
  }
}
