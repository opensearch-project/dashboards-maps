/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
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
  savedMapObject: SimpleSavedObject<MapSavedObjectAttributes> | null | undefined;
}

export const MapTopNavMenu = ({ mapIdFromUrl, savedMapObject, layers }: MapTopNavMenuProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    setHeaderActionMenu,
    navigation: {
      ui: { TopNavMenu },
    },
    chrome,
    application: { navigateToApp },
  } = services;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (savedMapObject) {
      setTitle(savedMapObject.attributes.title);
      setDescription(savedMapObject.attributes.description!);
      chrome.setBreadcrumbs(getSavedMapBreadcrumbs(title, navigateToApp));
      chrome.docTitle.change(title);
    } else {
      chrome.setBreadcrumbs(getCreateBreadcrumbs(navigateToApp));
      chrome.docTitle.change('Create');
    }
  }, [chrome, savedMapObject, mapIdFromUrl, navigateToApp, title]);

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
