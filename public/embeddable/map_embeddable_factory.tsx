/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import {
  IContainer,
  EmbeddableFactoryDefinition,
  ErrorEmbeddable,
  SavedObjectEmbeddableInput,
} from '../../../../src/plugins/embeddable/public';
import { MAP_EMBEDDABLE, MapInput, MapOutput, MapEmbeddable } from './map_embeddable';
import { DASHBOARDS_MAPS_LAYER_TYPE, MAPS_APP_ICON, MAPS_APP_ID } from '../../common';
import { MapSavedObjectAttributes } from '../../common/map_saved_object_attributes';
import { MAPS_APP_DISPLAY_NAME } from '../../common/constants/shared';
import { MapLayerSpecification } from '../model/mapLayerType';
import { IndexPattern } from '../../../../src/plugins/data/common';

interface StartServices {
  services: {
    application: {
      getUrlForApp: (appId: string, options?: { path?: string }) => string;
      navigateToApp: (appId: string, options?: { path?: string }) => Promise<void>;
    };
    savedObjects: {
      client: {
        get: (type: string, id: string) => Promise<any>;
      };
    };
    data: {
      indexPatterns: {
        get: (id: string) => Promise<IndexPattern>;
      };
    };
  };
}

export class MapEmbeddableFactoryDefinition
  implements EmbeddableFactoryDefinition<MapInput, MapOutput, MapEmbeddable>
{
  public readonly type = MAP_EMBEDDABLE;

  public readonly savedObjectMetaData = {
    name: MAPS_APP_DISPLAY_NAME,
    type: MAP_EMBEDDABLE,
    getIconForSavedObject: () => MAPS_APP_ICON,
  };

  constructor(private getStartServices: () => Promise<StartServices>) {}

  public async isEditable() {
    return true;
  }

  // Maps app will be created from visualization list
  public canCreateNew() {
    return false;
  }

  public createFromSavedObject = async (
    savedObjectId: string,
    input: Partial<SavedObjectEmbeddableInput> & { id: string },
    parent?: IContainer
  ): Promise<MapEmbeddable | ErrorEmbeddable> => {
    try {
      const { services } = await this.getStartServices();
      const url = services.application.getUrlForApp(MAPS_APP_ID, {
        path: savedObjectId,
      });
      const savedMap = await services.savedObjects.client.get(MAP_EMBEDDABLE, savedObjectId);
      const savedMapAttributes = savedMap.attributes as MapSavedObjectAttributes;
      const layerList: MapLayerSpecification[] = JSON.parse(savedMapAttributes.layerList as string);
      const indexPatterns: IndexPattern[] = [];
      for (const layer of layerList) {
        if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
          const indexPatternId = layer.source.indexPatternId;
          const indexPattern = await services.data.indexPatterns.get(indexPatternId);
          indexPatterns.push(indexPattern);
        }
      }
      return new MapEmbeddable(
        {
          ...input,
          savedObjectId,
          title: savedMapAttributes.title,
        },
        {
          indexPatterns,
          parent,
          services,
          editUrl: url,
          savedMapAttributes,
        }
      );
    } catch (error) {
      return new ErrorEmbeddable(error.message, input);
    }
  };

  public async create(initialInput: MapInput, parent?: IContainer) {
    return undefined;
  }

  public getDisplayName() {
    return i18n.translate('maps.displayName', {
      defaultMessage: MAPS_APP_DISPLAY_NAME,
    });
  }
}
