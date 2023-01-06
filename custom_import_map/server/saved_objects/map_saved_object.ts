/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedObjectsType } from 'opensearch-dashboards/server';

export const mapSavedObjectsType: SavedObjectsType = {
  name: 'map',
  hidden: false,
  namespaceType: 'agnostic',
  management: {
    defaultSearchField: 'title',
    importableAndExportable: true,
    getTitle(obj) {
      return obj.attributes.title;
    },
    getInAppUrl(obj) {
      return {
        path: `/app/maps-dashboards#/${encodeURIComponent(obj.id)}`,
        uiCapabilitiesPath: 'map.show',
      };
    },
    getEditUrl(obj) {
      return `/management/opensearch-dashboards/objects/map/${encodeURIComponent(obj.id)}`;
    },
  },
  mappings: {
    properties: {
      title: { type: 'text' },
      description: { type: 'text' },
      layerList: { type: 'text', index: false },
      uiState: { type: 'text', index: false },
      mapState: { type: 'text', index: false },
      version: { type: 'integer' },
      // Need to add a kibanaSavedObjectMeta attribute here to follow the current saved object flow
      // When we save a saved object, the saved object plugin will extract the search source into two parts
      // Some information will be put into kibanaSavedObjectMeta while others will be created as a reference object and pushed to the reference array
      kibanaSavedObjectMeta: {
        properties: { searchSourceJSON: { type: 'text', index: false } },
      },
    },
  },
  migrations: {},
};
