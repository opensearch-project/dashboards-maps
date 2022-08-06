/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { schema, TypeOf } from '@osd/config-schema';

const tileMapConfigSchema = schema.object({
  url: schema.maybe(schema.string()),
  options: schema.object({
    attribution: schema.string({ defaultValue: '' }),
    minZoom: schema.number({ defaultValue: 0, min: 0 }),
    maxZoom: schema.number({ defaultValue: 10 }),
    tileSize: schema.maybe(schema.number()),
    subdomains: schema.maybe(schema.arrayOf(schema.string())),
    errorTileUrl: schema.maybe(schema.string()),
    tms: schema.maybe(schema.boolean()),
    reuseTiles: schema.maybe(schema.boolean()),
    bounds: schema.maybe(schema.arrayOf(schema.number({ min: 2 }))),
    default: schema.maybe(schema.boolean()),
  }),
});

export const regionMapConfigSchema = schema.object({
  includeOpenSearchMapsService: schema.boolean({ defaultValue: true }),
  layers: schema.arrayOf(
    schema.object({
      url: schema.string(),
      format: schema.object({
        type: schema.string({ defaultValue: 'geojson' }),
      }),
      meta: schema.object({
        feature_collection_path: schema.string({ defaultValue: 'data' }),
      }),
      attribution: schema.string(),
      name: schema.string(),
      fields: schema.arrayOf(
        schema.object({
          name: schema.string(),
          description: schema.string(),
        })
      ),
    }),
    { defaultValue: [] }
  ),
});

export const configSchema = schema.object({
  includeOpenSearchMapsService: schema.boolean({ defaultValue: true }),
  proxyOpenSearchMapsServiceInMaps: schema.boolean({ defaultValue: false }),
  showRegionBlockedWarning: schema.boolean({ defaultValue: false }),
  tilemap: tileMapConfigSchema,
  regionmap: regionMapConfigSchema,
  manifestServiceUrl: schema.string({ defaultValue: '' }),
  opensearchManifestServiceUrl: schema.string({
    defaultValue: 'https://maps.opensearch.org/manifest',
  }),
  emsFileApiUrl: schema.string({
    defaultValue: 'https://vectors.maps.opensearch.org',
  }),
  emsTileApiUrl: schema.string({ defaultValue: 'https://tiles.maps.opensearch.org' }),
  emsLandingPageUrl: schema.string({ defaultValue: 'https://maps.opensearch.org' }),
  emsFontLibraryUrl: schema.string({
    defaultValue: 'https://tiles.maps.opensearch.org/fonts/{fontstack}/{range}.pbf',
  }),
  emsTileLayerId: schema.object({
    bright: schema.string({ defaultValue: 'road_map' }),
    desaturated: schema.string({ defaultValue: 'road_map_desaturated' }),
    dark: schema.string({ defaultValue: 'dark_map' }),
  }),
});

export type MapsExplorerDashboardsConfig = TypeOf<typeof configSchema>;
