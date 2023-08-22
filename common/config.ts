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
    defaultValue: 'https://tiles.maps.opensearch.org/v3/manifest.json',
  }),
  opensearchVectorTileGlyphsUrl: schema.string({
    defaultValue: 'https://tiles.maps.opensearch.org/fonts/{fontstack}/{range}.pbf',
  }),
});

export type ConfigSchema = TypeOf<typeof configSchema>;
