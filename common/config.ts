/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { schema, TypeOf } from '@osd/config-schema';

export const configSchema = schema.object({
  opensearchVectorTileDataUrl: schema.string({
    defaultValue: 'https://tiles.maps.opensearch.org/data/v1.json',
  }),
  opensearchVectorTileStyleUrl: schema.string({
    // TODO: Change this to the production URL once it is available
    defaultValue: 'https://staging.tiles.maps.opensearch.org/styles/manifest.json',
  }),
  opensearchVectorTileGlyphsUrl: schema.string({
    defaultValue: 'https://tiles.maps.opensearch.org/fonts/{fontstack}/{range}.pbf',
  }),
});

export type ConfigSchema = TypeOf<typeof configSchema>;
