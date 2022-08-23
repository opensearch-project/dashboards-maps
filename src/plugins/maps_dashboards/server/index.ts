/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PluginInitializerContext } from '../../../src/core/server';
import { MapsDashboardsPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new MapsDashboardsPlugin(initializerContext);
}

export { MapsDashboardsPluginSetup, MapsDashboardsPluginStart } from './types';
