/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { fromMBtoBytes } from '../util';

export const ALLOWED_FILE_EXTENSIONS = ['.json', '.geojson'];
export const BASE_NODE_API_PATH = '/_plugins/geospatial';
export const UPLOAD_GEOJSON_API_PATH = `${BASE_NODE_API_PATH}/geojson/_upload`;
export const MAX_FILE_PAYLOAD_SIZE_IN_MB = 25;
export const MAX_FILE_PAYLOAD_SIZE = fromMBtoBytes(MAX_FILE_PAYLOAD_SIZE_IN_MB);
export const PLUGIN_ID = 'customImportMap';
export const PLUGIN_NAME = 'customImportMap';
export const PLUGIN_NAVIGATION_BAR_TILE = 'Maps';
