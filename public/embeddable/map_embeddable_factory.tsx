/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import {
  IContainer,
  EmbeddableFactoryDefinition,
  EmbeddableFactory,
  ErrorEmbeddable,
  SavedObjectEmbeddableInput,
} from '../../../../src/plugins/embeddable/public';
import { MAP_EMBEDDABLE, MapInput, MapOutput, MapEmbeddable } from './map_embeddable';
import { APP_PATH, MAPS_APP_ICON, MAPS_APP_ID } from '../../common';
import { ConfigSchema } from '../../common/config';
import { MapSavedObjectAttributes } from '../../common/map_saved_object_attributes';
import { MAPS_APP_DISPLAY_NAME } from '../../common/constants/shared';

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
  };
  mapConfig: ConfigSchema;
}

export type MapEmbeddableFactory = EmbeddableFactory<MapInput, MapOutput, MapEmbeddable>;

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

  public canCreateNew() {
    // TODO: allow users to create a new map from the dashboard.
    return false;
  }

  public createFromSavedObject = async (
    savedObjectId: string,
    input: Partial<SavedObjectEmbeddableInput> & { id: string },
    parent?: IContainer
  ): Promise<MapEmbeddable | ErrorEmbeddable> => {
    try {
      const { services, mapConfig } = await this.getStartServices();
      const url = services.application.getUrlForApp(MAPS_APP_ID, {
        path: savedObjectId,
      });
      const savedMap = await services.savedObjects.client.get(MAP_EMBEDDABLE, savedObjectId);
      const savedMapAttributes = savedMap.attributes as MapSavedObjectAttributes;
      return new MapEmbeddable(
        {
          ...input,
          savedObjectId,
          title: savedMapAttributes.title,
        },
        {
          parent,
          services,
          mapConfig,
          editUrl: url,
          savedMapAttributes,
        }
      );
    } catch (error) {
      return new ErrorEmbeddable(error.message, input);
    }
  };

  public async create(initialInput: MapInput, parent?: IContainer) {
    const { services } = await this.getStartServices();
    await services.application.navigateToApp(MAPS_APP_ID, {
      path: `${APP_PATH.CREATE_MAP}?originatingApp=dashboards`,
    });
    return undefined;
  }

  public getDisplayName() {
    return i18n.translate('maps.displayName', {
      defaultMessage: MAPS_APP_DISPLAY_NAME,
    });
  }
}
