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
  checkForDuplicateTitle,
} from '../../../../../src/plugins/saved_objects/public';
import { MapServices } from '../../types';
import { MapState } from '../../model/mapState';

const SAVED_OBJECT_TYPE = 'map';

interface GetTopNavConfigParams {
  mapIdFromUrl: string;
  layers: any;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  mapState: MapState;
}

export const getTopNavConfig = (
  {
    notifications: { toasts },
    i18n: { Context: I18nContext },
    savedObjects: { client: savedObjectsClient },
    history,
    overlays,
  }: MapServices,
  {
    mapIdFromUrl,
    layers,
    title,
    description,
    setTitle,
    setDescription,
    mapState,
  }: GetTopNavConfigParams
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
        const onModalSave = async ({ newTitle, newDescription, onTitleDuplicate }: OnSaveProps) => {
          let newlySavedMap;
          const saveAttributes = {
            title: newTitle,
            description: newDescription,
            layerList: JSON.stringify(layers),
            mapState: JSON.stringify(mapState),
          };
          try {
            await checkForDuplicateTitle(
              {
                title: newTitle,
                lastSavedTitle: title,
                copyOnSave: false,
                getDisplayName: () => SAVED_OBJECT_TYPE,
                getOpenSearchType: () => SAVED_OBJECT_TYPE,
              },
              false,
              onTitleDuplicate,
              {
                savedObjectsClient,
                overlays,
              }
            );
          } catch (_error) {
            return {};
          }
          if (mapIdFromUrl) {
            // edit existing map
            newlySavedMap = await savedObjectsClient.update(
              SAVED_OBJECT_TYPE,
              mapIdFromUrl,
              saveAttributes
            );
          } else {
            // save new map
            newlySavedMap = await savedObjectsClient.create(SAVED_OBJECT_TYPE, saveAttributes);
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
