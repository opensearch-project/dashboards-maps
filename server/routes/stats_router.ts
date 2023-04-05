/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResponseError } from '@opensearch-project/opensearch/lib/errors';
import { Logger } from '@osd/logging';
import {
  IOpenSearchDashboardsResponse,
  IRouter,
  SavedObjectsFindResponse,
} from '../../../../src/core/server';
import { APP_API, APP_PATH, PER_PAGE_REQUEST_NUMBER } from '../../common';
import { getMapSavedObjects, getStats } from '../common/stats/stats_helper';
import { MapSavedObjectAttributes } from '../../common/map_saved_object_attributes';

export function statsRoute(router: IRouter, logger: Logger) {
  router.get(
    {
      path: `${APP_API}${APP_PATH.STATS}`,
      validate: {},
    },
    async (
      context,
      request,
      response
    ): Promise<IOpenSearchDashboardsResponse<any | ResponseError>> => {
      try {
        const savedObjectsClient = context.core.savedObjects.client;
        const mapsSavedObjects: SavedObjectsFindResponse<MapSavedObjectAttributes> =
          await getMapSavedObjects(savedObjectsClient, PER_PAGE_REQUEST_NUMBER);
        const stats = getStats(mapsSavedObjects);
        return response.ok({
          body: stats,
        });
      } catch (error) {
        logger.error(error);
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );
}
