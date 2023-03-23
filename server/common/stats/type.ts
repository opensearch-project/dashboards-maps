/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MAPS_STATS {
  maps_total: number;
  layers_filters_total: number;
  layers_count: LAYER_STATS;
  maps: MAP_STATS[];
}

export interface MAP_STATS {
  id: string;
  layers_filters_total: number;
  layers_count: LAYER_STATS;
}

export interface LAYER_STATS {
  total: number;
  documents: number;
  opensearch_base_map: number;
  custom_tms: number;
  custom_wms: number;
}
