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

export const getTopNavConfig = (services: MapServices) => {
  const {
    notifications: { toasts },
    i18n: { Context: I18nContext },
    savedObjects: { client: savedObjectsClient },
  } = services;

  const topNavConfig: TopNavMenuData[] = [
    {
      iconType: 'save',
      emphasize: true,
      id: 'save',
      label: i18n.translate('maps.topNav.saveMapButtonLabel', {
        defaultMessage: `Save`,
      }),
      run: (_anchorElement) => {
        const onModalSave = async (onSaveProps: OnSaveProps) => {
          const savedMap = await savedObjectsClient.create('map', {
            title: onSaveProps.newTitle,
            description: onSaveProps.newDescription,
            // TODO: Integrate other attributes to saved object
          });
          const id = savedMap.id;
          if (id) {
            toasts.addSuccess({
              title: i18n.translate('map.topNavMenu.saveMap.successNotificationText', {
                defaultMessage: `Saved ${onSaveProps.newTitle}`,
                values: {
                  visTitle: savedMap.attributes.title,
                },
              }),
            });
          }
          return { id };
        };

        const documentInfo = {
          title: '',
          description: '',
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
