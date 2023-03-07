/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { TopNavMenuData } from '../../../../../src/plugins/navigation/public';
import {
  SavedObjectSaveModalOrigin,
  showSaveModal,
  checkForDuplicateTitle,
  SavedObjectSaveOpts,
} from '../../../../../src/plugins/saved_objects/public';
import { MapServices } from '../../types';
import { MapState } from '../../model/mapState';
import { MAP_SAVED_OBJECT_TYPE } from '../../../common';

interface GetTopNavConfigParams {
  mapIdFromUrl: string;
  layers: any;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  mapState: MapState;
  originatingApp?: string;
}

export const getTopNavConfig = (
  services: MapServices,
  {
    mapIdFromUrl,
    layers,
    title,
    description,
    setTitle,
    setDescription,
    mapState,
    originatingApp,
  }: GetTopNavConfigParams
) => {
  const {
    embeddable,
    i18n: { Context: I18nContext },
    scopedHistory,
  } = services;
  const stateTransfer = embeddable.getStateTransfer(scopedHistory);
  const topNavConfig: TopNavMenuData[] = [
    {
      iconType: 'save',
      emphasize: true,
      id: 'save',
      label: i18n.translate('maps.topNav.saveMapButtonLabel', {
        defaultMessage: `Save`,
      }),
      testId: 'mapSaveButton',
      run: (_anchorElement: any) => {
        const documentInfo = {
          title,
          description,
        };

        const saveModal = (
          <SavedObjectSaveModalOrigin
            documentInfo={documentInfo}
            onSave={onGetSave(
              title,
              originatingApp,
              mapIdFromUrl,
              services,
              layers,
              mapState,
              setTitle,
              setDescription
            )}
            objectType={'map'}
            onClose={() => {}}
            originatingApp={originatingApp}
            getAppNameFromId={stateTransfer.getAppNameFromId}
          />
        );
        showSaveModal(saveModal, I18nContext);
      },
    },
  ];
  return topNavConfig;
};

export const onGetSave = (
  title: string,
  originatingApp: string | undefined,
  mapIdFromUrl: string,
  services: MapServices,
  layers: any,
  mapState: MapState,
  setTitle: (title: string) => void,
  setDescription: (description: string) => void
) => {
  const onSave = async ({
    newTitle,
    newDescription,
    onTitleDuplicate,
    returnToOrigin,
  }: SavedObjectSaveOpts & {
    newTitle: string;
    newCopyOnSave: boolean;
    returnToOrigin: boolean;
    newDescription?: string;
  }) => {
    const {
      savedObjects: { client: savedObjectsClient },
      history,
      toastNotifications,
      overlays,
      embeddable,
      application,
    } = services;
    const stateTransfer = embeddable.getStateTransfer();
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
          getDisplayName: () => MAP_SAVED_OBJECT_TYPE,
          getOpenSearchType: () => MAP_SAVED_OBJECT_TYPE,
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
    try {
      if (mapIdFromUrl) {
        // edit existing map
        newlySavedMap = await savedObjectsClient.update(
          MAP_SAVED_OBJECT_TYPE,
          mapIdFromUrl,
          saveAttributes
        );
      } else {
        // save new map
        newlySavedMap = await savedObjectsClient.create(MAP_SAVED_OBJECT_TYPE, saveAttributes);
      }
      const id = newlySavedMap.id;
      if (id) {
        history.push({
          ...history.location,
          pathname: `${id}`,
        });
        setTitle(newTitle);
        if (newDescription) {
          setDescription(newDescription);
        }
        toastNotifications.addSuccess({
          title: i18n.translate('map.topNavMenu.saveMap.successNotificationText', {
            defaultMessage: `Saved ${newTitle}`,
            values: {
              visTitle: newTitle,
            },
          }),
        });
        if (originatingApp && returnToOrigin) {
          // create or edit map directly from another app, such as `dashboard`
          if (!mapIdFromUrl && stateTransfer) {
            // create new embeddable to transfer to originatingApp
            await stateTransfer.navigateToWithEmbeddablePackage(originatingApp, {
              state: { type: MAP_SAVED_OBJECT_TYPE, input: { savedObjectId: id } },
            });
            return { id };
          } else {
            // update an existing visBuilder from another app
            application.navigateToApp(originatingApp);
          }
        }
      }
      return { id };
    } catch (error: any) {
      toastNotifications.addDanger({
        title: i18n.translate('maps.topNavMenu.saveVisualization.failureNotificationText', {
          defaultMessage: `Error on saving ${newTitle}`,
          values: {
            visTitle: newTitle,
          },
        }),
        text: error.message,
        'data-test-subj': 'saveMapError',
      });
      return { error };
    }
  };
  return onSave;
};
