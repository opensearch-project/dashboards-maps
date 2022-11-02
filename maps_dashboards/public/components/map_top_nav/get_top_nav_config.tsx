/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { TopNavMenuData } from '../../../../../src/plugins/navigation/public';
import {
  OnSaveProps,
  SavedObjectSaveModalOrigin,
  showSaveModal,
} from '../../../../../src/plugins/saved_objects/public';
import { MapServices } from '../../types';

interface GetTopNavConfigParams {
  mapIdFromUrl: string;
  layers: any;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

export const getTopNavConfig = (
  {
    notifications: { toasts },
    i18n: { Context: I18nContext },
    savedObjects: { client: savedObjectsClient },
    history,
  }: MapServices,
  { mapIdFromUrl, layers, title, description, setTitle, setDescription }: GetTopNavConfigParams
) => {
  const topNavConfig: TopNavMenuData[] = [
    {
      iconType: 'save',
      emphasize: true,
      id: 'save',
      label: i18n.translate('maps.topNav.saveMapButtonLabel', {
        defaultMessage: `Save`,
      }),
      run: (_anchorElement) => {
        const onModalSave = async ({ newTitle, newDescription }: OnSaveProps) => {
          let newlySavedMap;
          if (mapIdFromUrl) {
            // edit existing map
            newlySavedMap = await savedObjectsClient.update('map', mapIdFromUrl, {
              title: newTitle,
              description: newDescription,
              layerList: JSON.stringify(layers),
            });
          } else {
            // save new map
            newlySavedMap = await savedObjectsClient.create('map', {
              title: newTitle,
              description: newDescription,
              layerList: JSON.stringify(layers),
            });
          }
          const id = newlySavedMap.id;
          if (id) {
            history.push({
              ...history.location,
              pathname: `${id}`,
            });
            setTitle(newTitle);
            setDescription(newDescription);
            toasts.addSuccess({
              title: i18n.translate('map.topNavMenu.saveMap.successNotificationText', {
                defaultMessage: `Saved ${newTitle}`,
                values: {
                  visTitle: newTitle,
                },
              }),
            });
          }
          return { id };
        };

        const documentInfo = {
          title,
          description,
        };

        const saveModal = (
          <SavedObjectSaveModalOrigin
            documentInfo={documentInfo}
            onSave={onModalSave}
            objectType={'map'}
            onClose={() => {}}
          />
        );
        showSaveModal(saveModal, I18nContext);
      },
    },
  ];
  return topNavConfig;
};
