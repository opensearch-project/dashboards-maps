/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Subscription } from 'rxjs';
import { MAP_SAVED_OBJECT_TYPE, MAPS_APP_ID } from '../../common';
import {
  Embeddable,
  EmbeddableInput,
  EmbeddableOutput,
  IContainer,
} from '../../../../src/plugins/embeddable/public';
import { MapEmbeddableComponent } from './map_component';
import { MapSavedObjectAttributes } from '../../common/map_saved_object_attributes';
import { IndexPattern, RefreshInterval } from '../../../../src/plugins/data/public';

export const MAP_EMBEDDABLE = MAP_SAVED_OBJECT_TYPE;

export interface MapInput extends EmbeddableInput {
  savedObjectId: string;
  refreshConfig?: RefreshInterval;
}

export interface MapOutput extends EmbeddableOutput {
  editable: boolean;
  editUrl: string;
  defaultTitle: string;
  editApp: string;
  editPath: string;
  indexPatterns: IndexPattern[];
}

function getOutput(
  input: MapInput,
  editUrl: string,
  tittle: string,
  indexPatterns: IndexPattern[]
): MapOutput {
  return {
    editable: true,
    editUrl,
    defaultTitle: tittle,
    editApp: MAPS_APP_ID,
    editPath: input.savedObjectId,
    indexPatterns,
  };
}

export class MapEmbeddable extends Embeddable<MapInput, MapOutput> {
  public readonly type = MAP_EMBEDDABLE;
  private subscription: Subscription;
  private node?: HTMLElement;
  private readonly services: any;
  constructor(
    initialInput: MapInput,
    {
      parent,
      services,
      editUrl,
      savedMapAttributes,
      indexPatterns,
    }: {
      parent?: IContainer;
      services: any;
      editUrl: string;
      savedMapAttributes: MapSavedObjectAttributes;
      indexPatterns: IndexPattern[];
    }
  ) {
    super(
      initialInput,
      getOutput(initialInput, editUrl, savedMapAttributes.title, indexPatterns),
      parent
    );
    this.services = services;
    this.subscription = this.getInput$().subscribe(() => {
      this.updateOutput(getOutput(this.input, editUrl, savedMapAttributes.title, indexPatterns));
    });
  }

  public render(node: HTMLElement) {
    this.node = node;
    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node);
    }
    ReactDOM.render(<MapEmbeddableComponent embeddable={this} />, node);
  }

  public reload() {
    if (this.node) {
      this.render(this.node);
    }
  }

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
}
