/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Subscription } from 'rxjs';
import { MAP_SAVED_OBJECT_TYPE } from '../../common';
import {
  Embeddable,
  EmbeddableInput,
  EmbeddableOutput,
  IContainer,
} from '../../../../src/plugins/embeddable/public';
import { MapEmbeddableComponent } from './map_component';
import { ConfigSchema } from '../../common/config';
import { MapSavedObjectAttributes } from '../../common/map_saved_object_attributes';

export const MAP_EMBEDDABLE = MAP_SAVED_OBJECT_TYPE;

export interface MapInput extends EmbeddableInput {
  search?: string;
  savedObjectId: string;
}

export type MapOutput = EmbeddableOutput;

function getOutput(input: MapInput, editUrl: string, tittle: string): MapOutput {
  return {
    editable: true,
    editUrl,
    defaultTitle: tittle,
  };
}

export class MapEmbeddable extends Embeddable<MapInput, MapOutput> {
  public readonly type = MAP_EMBEDDABLE;
  private subscription: Subscription;
  private node?: HTMLElement;
  private mapConfig: ConfigSchema;
  private services: any;

  constructor(
    initialInput: MapInput,
    {
      parent,
      services,
      mapConfig,
      editUrl,
      savedMapAttributes,
    }: {
      parent?: IContainer;
      services: any;
      mapConfig: ConfigSchema;
      editUrl: string;
      savedMapAttributes: MapSavedObjectAttributes;
    }
  ) {
    super(initialInput, getOutput(initialInput, editUrl, savedMapAttributes.title), parent);
    this.mapConfig = mapConfig;
    this.services = services;
    this.subscription = this.getInput$().subscribe(() => {
      this.updateOutput(getOutput(this.input, editUrl, savedMapAttributes.title));
    });
  }

  public render(node: HTMLElement) {
    this.node = node;
    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node);
    }
    ReactDOM.render(<MapEmbeddableComponent embeddable={this} />, node);
  }

  public reload() {}

  public destroy() {
    super.destroy();
    this.subscription.unsubscribe();
    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node);
    }
  }
  public getServiceSettings() {
    return this.services;
  }
  public getMapConfig() {
    return this.mapConfig;
  }
}
