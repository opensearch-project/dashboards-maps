/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import { OSMLayerFunctions } from './OSMLayerFunctions';

export const layersFunctionMap: { [key: string]: any } = {
  [DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP]: OSMLayerFunctions,
};
