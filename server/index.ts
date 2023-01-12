/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import { CustomImportMapPlugin } from './plugin';
import { ConfigSchema, configSchema } from '../common/config';
// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new CustomImportMapPlugin(initializerContext);
}

export { CustomImportMapPluginSetup, CustomImportMapPluginStart } from './types';

export const config: PluginConfigDescriptor<ConfigSchema> = {
  exposeToBrowser: {
    opensearchVectorTileDataUrl: true,
    opensearchVectorTileStyleUrl: true,
    opensearchVectorTileGlyphsUrl: true,
  },
  schema: configSchema,
};
