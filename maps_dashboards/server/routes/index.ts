/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * This is temporary API code for plugin to work, will be
 * removed in the future.
 */

import { IRouter } from '../../../../src/core/server';

const SAMPLE_NUMBER = 3;

export function defineRoutes(router: IRouter) {
  router.post(
    {
      path: '/api/maps-dashboards/example',
      validate: false,
    },
    async (context, request, response) => {
      const hits = [];
      for (let i = 0; i < SAMPLE_NUMBER; i++) {
        hits.push({
          id: `map ${i}`,
          title: `Map ${i}`,
          description: `Sample Map ${i} description`,
        });
      }
      return response.ok({
        body: {
          hits,
        },
      });
    }
  );
}
