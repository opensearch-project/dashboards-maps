/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { fromMBtoBytes } from '../util';

export const BASE_NODE_API_PATH = '/_plugins/geospatial';
export const UPLOAD_GEOJSON_API = `${BASE_NODE_API_PATH}/geojson/_upload`;
export const FILE_PAYLOAD_SIZE_IN_MB = 25;
export const FILE_PAYLOAD_SIZE = fromMBtoBytes(FILE_PAYLOAD_SIZE_IN_MB);
