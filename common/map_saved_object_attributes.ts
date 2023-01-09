/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedObjectAttributes } from 'opensearch-dashboards/server';

export interface MapSavedObjectAttributes extends SavedObjectAttributes {
  /** Title of the map */
  title: string;
  /** Description of the map */
  description?: string;
  /** State of the map, which could include current zoom level, lat, lng etc. */
  mapState?: string;
  /** Maps-dashboards layers of the map */
  layerList?: string;
  /** UI state of the map */
  uiState?: string;
  /** Version is used to track version differences in saved object mapping */
  version: number;
  /** SearchSourceFields is used to reference other saved objects */
  searchSourceFields?: {
    index?: string;
  };
}
