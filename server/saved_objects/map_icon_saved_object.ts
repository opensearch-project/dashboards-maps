/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedObjectsType } from 'opensearch-dashboards/server';

export const MAP_ICON_SAVED_OBJECT_TYPE = 'map-icon';

export const mapIconSavedObjectsType: SavedObjectsType = {
  name: MAP_ICON_SAVED_OBJECT_TYPE,
  hidden: false,
  namespaceType: 'single',
  management: {
    defaultSearchField: 'name',
    importableAndExportable: true,
    getTitle(obj: any) {
      return obj.attributes.name;
    },
    getInAppUrl(obj: any) {
      return {
        path: `/app/maps-dashboards#/icons/${encodeURIComponent(obj.id)}`,
        uiCapabilitiesPath: 'map.show',
      };
    },
  },
  mappings: {
    properties: {
      name: { type: 'text' },
      svg: { type: 'text', index: false },
    },
  },
  migrations: {},
};
