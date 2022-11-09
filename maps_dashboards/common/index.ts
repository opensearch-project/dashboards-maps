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
export const MAP_DEFAULT_OPACITY = 1;

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

export enum DASHBOARDS_MAPS_LAYER_TYPE {
  OPENSEARCH_MAP = 'OpenSearch Map',
}

export const LAYER_VISIBILITY = {
  NONE: 'none',
  VISIBLE: 'visible',
};