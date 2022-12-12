/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const PLUGIN_ID = 'maps-dashboards';
export const PLUGIN_NAME = 'Maps';

export const MAP_VECTOR_TILE_BASIC_STYLE = 'https://tiles.maps.opensearch.org/styles/basic.json';
export const MAP_GLYPHS = 'https://tiles.maps.opensearch.org/fonts/{fontstack}/{range}.pbf';
export const MAP_VECTOR_TILE_DATA_SOURCE = 'https://tiles.maps.opensearch.org/data/v1.json';
export const MAP_DEFAULT_MIN_ZOOM = 0;
export const MAP_DEFAULT_MAX_ZOOM = 22;
export const MAP_REFERENCE_LAYER_DEFAULT_OPACITY = 100;
export const MAP_DATA_LAYER_DEFAULT_OPACITY = 70;
export const MAP_LAYER_DEFAULT_MIN_OPACITY = 0;
export const MAP_LAYER_DEFAULT_MAX_OPACITY = 100;
export const MAP_LAYER_DEFAULT_OPACITY_STEP = 1;
export const MAP_LAYER_DEFAULT_BORDER_THICKNESS = 1;
export const DOCUMENTS_DEFAULT_REQUEST_NUMBER = 20;
export const DOCUMENTS_DEFAULT_MARKER_SIZE = 5;
export const LAYER_PANEL_SHOW_LAYER_ICON = 'eye';
export const LAYER_PANEL_HIDE_LAYER_ICON = 'eyeClosed';
export const MAX_LAYER_NAME_LIMIT = 35;

// Starting position [lng, lat] and zoom
export const MAP_INITIAL_STATE = {
  lng: 0,
  lat: 0,
  zoom: 1,
};

export const APP_PATH = {
  LANDING_PAGE_PATH: '/',
  CREATE_MAP: '/create',
  EDIT_MAP: '/:id',
};

export enum DASHBOARDS_MAPS_LAYER_NAME {
  OPENSEARCH_MAP = 'OpenSearch Map',
  DOCUMENTS = 'Documents',
}

export enum DASHBOARDS_MAPS_LAYER_TYPE {
  OPENSEARCH_MAP = 'opensearch_vector_tile_map',
  DOCUMENTS = 'documents',
}

export const DASHBOARDS_MAPS_LAYER_ICON = {
  OPENSEARCH_MAP: 'visMapRegion',
  DOCUMENTS: 'document',
};

export const DOCUMENTS = {
  name: DASHBOARDS_MAPS_LAYER_NAME.DOCUMENTS,
  type: DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS,
  icon: DASHBOARDS_MAPS_LAYER_ICON.DOCUMENTS,
};

export const OPENSEARCH_MAP_LAYER = {
  name: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
  type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
  icon: DASHBOARDS_MAPS_LAYER_ICON.OPENSEARCH_MAP,
};

export const LAYER_VISIBILITY = {
  NONE: 'none',
  VISIBLE: 'visible',
};

export const LAYER_ICON_TYPE_MAP: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: 'visMapRegion',
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: 'document',
};
