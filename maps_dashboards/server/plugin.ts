/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';
import { capabilitiesProvider } from './saved_objects/capabilities_provider';
import { MapsDashboardsPluginSetup, MapsDashboardsPluginStart } from './types';
import { mapSavedObjectsType } from './saved_objects';

export class MapsDashboardsPlugin
  implements Plugin<MapsDashboardsPluginSetup, MapsDashboardsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup({ capabilities, http, savedObjects }: CoreSetup) {
    this.logger.debug('mapsDashboards: Setup');

    // Register saved object types
    savedObjects.registerType(mapSavedObjectsType);

    // Register capabilities
    capabilities.registerProvider(capabilitiesProvider);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('mapsDashboards: Started');
    return {};
  }

  public stop() {}
}
