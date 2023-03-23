/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResponseError } from '@opensearch-project/opensearch/lib/errors';
import {
  IOpenSearchDashboardsResponse,
  IRouter,
  SavedObjectsFindResponse,
} from '../../../../src/core/server';
import { APP_API, APP_PATH, MAP_SAVED_OBJECT_TYPE } from '../../common';
import { getStats } from '../common/stats/stats_helper';
import { MapSavedObjectAttributes } from '../../common/map_saved_object_attributes';

export function statsRoute(router: IRouter) {
  router.get(
    {
      path: `${APP_API}${APP_PATH.STATS}`,
      validate: false,
    },
    async (
      context,
      request,
      response
    ): Promise<IOpenSearchDashboardsResponse<any | ResponseError>> => {
      try {
        const savedObjectsClient = context.core.savedObjects.client;
        const mapsSavedObjects: SavedObjectsFindResponse<MapSavedObjectAttributes> =
          await savedObjectsClient?.find({ type: MAP_SAVED_OBJECT_TYPE });
        const stats = getStats(mapsSavedObjects);
        return response.ok({
          body: stats,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );
}
