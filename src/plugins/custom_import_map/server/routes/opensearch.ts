/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { schema } from '@osd/config-schema';

// eslint-disable-next-line import/no-default-export
export default function (services, router) {
  router.post(
    {
      path: '/api/custom_import_map/_indices',
      validate: {
        body: schema.object({
          index: schema.string(),
        }),
      },
    },
    services.getIndex
  );

  router.post(
    {
      path: '/api/custom_import_map/_plugins',
      validate: false,
    },
    services.getPlugins
  );
}
