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

import { MapsDashboardsPluginSetup, MapsDashboardsPluginStart } from './types';
import { defineRoutes } from './routes';

export class MapsDashboardsPlugin
  implements Plugin<MapsDashboardsPluginSetup, MapsDashboardsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('mapsDashboards: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('mapsDashboards: Started');
    return {};
  }

  public stop() {}
}
