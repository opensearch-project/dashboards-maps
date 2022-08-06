/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import { configSchema, MapsExplorerDashboardsConfig } from '../config';
import { MapsExplorerDashboardsPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export const config: PluginConfigDescriptor<MapsExplorerDashboardsConfig> = {
  exposeToBrowser: {
    includeOpenSearchMapsService: true,
    proxyOpenSearchMapsServiceInMaps: true,
    showRegionBlockedWarning: true,
    tilemap: true,
    regionmap: true,
    manifestServiceUrl: true,
    opensearchManifestServiceUrl: true,
    emsFileApiUrl: true,
    emsTileApiUrl: true,
    emsLandingPageUrl: true,
    emsFontLibraryUrl: true,
    emsTileLayerId: true,
  },
  schema: configSchema,
  deprecations: ({ renameFromRoot }) => [
    renameFromRoot('map.includeElasticMapsService', 'map.includeOpenSearchMapsService'),
    renameFromRoot('map.proxyOpenSearchMapsServiceInMaps', 'map.proxyElasticMapsServiceInMaps'),
    renameFromRoot(
      'map.regionmap.includeElasticMapsService',
      'map.regionmap.includeOpenSearchMapsService'
    ),
  ],
};

export function plugin(initializerContext: PluginInitializerContext) {
  return new MapsExplorerDashboardsPlugin(initializerContext);
}

export { MapsExplorerDashboardsPluginSetup, MapsExplorerDashboardsPluginStart } from './types';
