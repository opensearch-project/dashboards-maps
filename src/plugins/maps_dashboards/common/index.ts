/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const PLUGIN_ID = 'maps-dashboards';
export const PLUGIN_NAME = 'Maps';

export const MAP_VECTOR_TILE_URL = 'https://tiles.maps.opensearch.org/styles/basic.json';

// Starting position [lng, lat] and zoom
export const MAP_INITIAL_STATE = {
  lng: 0,
  lat: 0,
  zoom: 1,
};

export const APP_PATH = {
  CREATE_MAP: '/create-map',
};

export enum DASHBOARDS_MAPS_LAYER_TYPE {
  OPENSEARCH_MAP = 'OpenSearch Map',
}

export const LAYER_VISIBILITY = {
  NONE: 'none',
  VISIBLE: 'visible',
};
