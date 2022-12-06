/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DASHBOARDS_MAPS_LAYER_NAME, DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import { OSMLayerFunctions } from './OSMLayerFunctions';
import { DocumentLayerFunctions } from './documentLayerFunctions';

export const layersFunctionMap: { [key: string]: any } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: OSMLayerFunctions,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DocumentLayerFunctions,
};

export const layersTypeNameMap: { [key: string]: string } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: DASHBOARDS_MAPS_LAYER_NAME.OPENSEARCH_MAP,
  [DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS]: DASHBOARDS_MAPS_LAYER_NAME.DOCUMENTS,
};
