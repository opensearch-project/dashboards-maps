/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SimpleSavedObject } from 'opensearch-dashboards/public';
import { PLUGIN_ID } from '../../../common';
import { getTopNavConfig } from './get_top_nav_config';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { getSavedMapBreadcrumbs, getCreateBreadcrumbs } from '../../utils/breadcrumbs';

interface MapTopNavMenuProps {
  mapIdFromUrl: string;
  layers: any;
}

export const MapTopNavMenu = ({ mapIdFromUrl, layers }: MapTopNavMenuProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    setHeaderActionMenu,
    navigation: {
      ui: { TopNavMenu },
    },
    savedObjects: { client: savedObjectsClient },
    chrome,
    application: { navigateToApp },
  } = services;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const fetchMapObject = useCallback(async (): Promise<
    SimpleSavedObject<MapSavedObjectAttributes>
  > => {
    return await savedObjectsClient.get<MapSavedObjectAttributes>('map', mapIdFromUrl);
  }, [savedObjectsClient, mapIdFromUrl]);

  useEffect(() => {
    if (mapIdFromUrl) {
      fetchMapObject().then((object) => {
        setTitle(object.attributes.title);
        setDescription(object.attributes.description!);
      });
      chrome.setBreadcrumbs(getSavedMapBreadcrumbs(title, navigateToApp));
      chrome.docTitle.change(title);
    } else {
      chrome.setBreadcrumbs(getCreateBreadcrumbs(navigateToApp));
      chrome.docTitle.change('Create');
    }
  }, [chrome, fetchMapObject, mapIdFromUrl, navigateToApp, title]);

  return (
    <TopNavMenu
      appName={PLUGIN_ID}
      config={getTopNavConfig(services, {
        mapIdFromUrl,
        layers,
        title,
        description,
        setTitle,
        setDescription,
      })}
      setMenuMountPoint={setHeaderActionMenu}
    />
  );
};
