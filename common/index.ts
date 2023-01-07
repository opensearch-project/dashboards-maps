/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { fromMBtoBytes } from './util';
import {
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_PAYLOAD_SIZE,
  MAX_FILE_PAYLOAD_SIZE_IN_MB,
  PLUGIN_ID,
  PLUGIN_NAVIGATION_BAR_ID,
  PLUGIN_NAME,
} from './constants/shared';

export {
  fromMBtoBytes,
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_PAYLOAD_SIZE,
  MAX_FILE_PAYLOAD_SIZE_IN_MB,
  PLUGIN_ID,
  PLUGIN_NAVIGATION_BAR_ID,
  PLUGIN_NAME,
};

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
export const DOCUMENTS_DEFAULT_REQUEST_NUMBER = 1000;
export const DOCUMENTS_DEFAULT_SHOW_TOOLTIPS: boolean = false;
export const DOCUMENTS_DEFAULT_TOOLTIPS: string[] = [];
export const DOCUMENTS_DEFAULT_MARKER_SIZE = 5;
export const LAYER_PANEL_SHOW_LAYER_ICON = 'eye';
export const LAYER_PANEL_HIDE_LAYER_ICON = 'eyeClosed';
export const MAX_LAYER_NAME_LIMIT = 35;
export const MAP_LAYER_DEFAULT_NAME = 'Default map';
export const NEW_MAP_LAYER_DEFAULT_PREFIX = 'New layer';

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
  OPENSEARCH_MAP = 'OpenSearch map',
  DOCUMENTS = 'Documents',
  CUSTOM_MAP = 'Custom map',
}

export enum DASHBOARDS_MAPS_LAYER_TYPE {
  OPENSEARCH_MAP = 'opensearch_vector_tile_map',
  DOCUMENTS = 'documents',
  CUSTOM_MAP = 'custom_map',
}

export enum DASHBOARDS_MAPS_LAYER_ICON {
  OPENSEARCH_MAP = 'globe',
  DOCUMENTS = 'document',
  CUSTOM_MAP = 'globe',
}

export enum DASHBOARDS_MAPS_LAYER_DESCRIPTION {
  OPENSEARCH_MAP = 'Use default OpenSearch basemaps.',
  DOCUMENTS = 'View points, lines, and polygons on the map.',
  CUSTOM_MAP = 'Configure maps to use a custom map source.',
}

export const DOCUMENTS = {
  name: DASHBOARDS_MAPS_LAYER_NAME.DOCUMENTS,
  type: DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS,
  icon: DASHBOARDS_MAPS_LAYER_ICON.DOCUMENTS,
  description: DASHBOARDS_MAPS_LAYER_DESCRIPTION.DOCUMENTS,
};

export const OPENSEARCH_MAP_LAYER = {
  name: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
  type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
  icon: DASHBOARDS_MAPS_LAYER_ICON.OPENSEARCH_MAP,
  description: DASHBOARDS_MAPS_LAYER_DESCRIPTION.OPENSEARCH_MAP,
};

export const CUSTOM_MAP = {
  name: DASHBOARDS_MAPS_LAYER_NAME.CUSTOM_MAP,
  type: DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP,
  icon: DASHBOARDS_MAPS_LAYER_ICON.CUSTOM_MAP,
  description: DASHBOARDS_MAPS_LAYER_DESCRIPTION.CUSTOM_MAP,
};

export interface Layer {
  name: DASHBOARDS_MAPS_LAYER_NAME;
  type: DASHBOARDS_MAPS_LAYER_TYPE;
  icon: DASHBOARDS_MAPS_LAYER_ICON;
  description: DASHBOARDS_MAPS_LAYER_DESCRIPTION;
}

export const LAYER_VISIBILITY = {
  NONE: 'none',
  VISIBLE: 'visible',
};

export const LAYER_ICON_TYPE_MAP: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: 'globe',
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: 'document',
  [DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP]: 'globe',
};
