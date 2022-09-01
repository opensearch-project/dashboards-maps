/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const PLUGIN_ID = 'maps-dashboards';
export const PLUGIN_NAME = 'Maps';

// This style URL is only used for development, will replace with production vector tile service url.
export const MAP_VECTOR_TILE_URL =
  'https://dldbnqfps17cd.cloudfront.net/styles/basic-preview/compressedstyle.json';

// Starting position [lng, lat] and zoom
export const MAP_INITIAL_STATE = {
  lng: 0,
  lat: 0,
  zoom: 1,
};

export const APP_PATH = {
  CREATE_MAP: '/create-map',
};
