/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { schema } from '@osd/config-schema';
import { MAX_FILE_PAYLOAD_SIZE } from '../../common';

// eslint-disable-next-line import/no-default-export
export default function (services, router) {
  router.post(
    {
      path: '/api/custom_import_map/_upload',
      validate: {
        body: schema.any(),
        query: schema.maybe(schema.object({}, { unknowns: 'allow' })),
      },
      options: {
        body: {
          accepts: 'application/json',
          maxBytes: MAX_FILE_PAYLOAD_SIZE, // 25 MB payload limit for custom geoJSON feature
        },
      },
    },
    services.uploadGeojson
  );
}
