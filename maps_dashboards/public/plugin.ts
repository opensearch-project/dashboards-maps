/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  DEFAULT_APP_CATEGORIES,
  Plugin,
} from '../../../src/core/public';
import {
  MapsDashboardsPluginSetup,
  MapsDashboardsPluginStart,
  AppPluginStartDependencies,
  MapServices,
} from './types';
import { PLUGIN_NAME, PLUGIN_ID } from '../common';

export class MapsDashboardsPlugin
  implements Plugin<MapsDashboardsPluginSetup, MapsDashboardsPluginStart> {
  public setup(core: CoreSetup): MapsDashboardsPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: PLUGIN_ID,
      title: PLUGIN_NAME,
      category: DEFAULT_APP_CATEGORIES.opensearchDashboards,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in opensearch_dashboards.json
        const [coreStart, depsStart] = await core.getStartServices();
        const { navigation } = depsStart as AppPluginStartDependencies;
        const services: MapServices = {
          ...coreStart,
          setHeaderActionMenu: params.setHeaderActionMenu,
          appBasePath: params.history,
          element: params.element,
          navigation,
          toastNotifications: coreStart.notifications.toasts,
        };
        // Render the application
        return renderApp(params, services);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('mapsDashboards.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): MapsDashboardsPluginStart {
    return {};
  }

  public stop() {}
}
