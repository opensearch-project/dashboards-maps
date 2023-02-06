/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { i18n } from '@osd/i18n';
import React from 'react';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  Plugin,
  PluginInitializerContext,
} from '../../../src/core/public';
import {
  AppPluginStartDependencies,
  MapServices,
  CustomImportMapPluginSetup,
  CustomImportMapPluginStart,
} from './types';
import { PLUGIN_NAME, MAPS_APP_ID, MAPS_APP_DISPLAY_NAME } from '../common/constants/shared';
import { ConfigSchema } from '../common/config';
import { AppPluginSetupDependencies } from './types';
import { RegionMapVisualizationDependencies } from '../../../src/plugins/region_map/public';
import { VectorUploadOptions } from './components/vector_upload_options';
import { OpenSearchDashboardsContextProvider } from '../../../src/plugins/opensearch_dashboards_react/public';
import { MAP_SAVED_OBJECT_TYPE } from '../common';
import { MapEmbeddableFactoryDefinition } from './embeddable';

export class CustomImportMapPlugin
  implements Plugin<CustomImportMapPluginSetup, CustomImportMapPluginStart>
{
  readonly _initializerContext: PluginInitializerContext<ConfigSchema>;
  constructor(initializerContext: PluginInitializerContext<ConfigSchema>) {
    this._initializerContext = initializerContext;
  }
  public setup(
    core: CoreSetup,
    { regionMap, embeddable, visualizations }: AppPluginSetupDependencies
  ): CustomImportMapPluginSetup {
    const mapConfig: ConfigSchema = {
      ...this._initializerContext.config.get<ConfigSchema>(),
    };
    // Register an application into the side navigation menu
    core.application.register({
      id: MAPS_APP_ID,
      title: MAPS_APP_DISPLAY_NAME,
      order: 5100,
      category: {
        id: 'opensearch',
        label: 'OpenSearch Plugins',
        order: 2000,
      },
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in opensearch_dashboards.json
        const [coreStart, depsStart] = await core.getStartServices();
        const { navigation, data } = depsStart as AppPluginStartDependencies;

        // make sure the index pattern list is up-to-date
        data.indexPatterns.clearCache();
        // make sure a default index pattern exists
        // if not, the page will be redirected to management and maps won't be rendered
        await data.indexPatterns.ensureDefaultIndexPattern();

        const services: MapServices = {
          ...coreStart,
          setHeaderActionMenu: params.setHeaderActionMenu,
          appBasePath: params.history,
          element: params.element,
          navigation,
          toastNotifications: coreStart.notifications.toasts,
          history: params.history,
          data,
        };
        params.element.classList.add('mapAppContainer');
        // Render the application
        return renderApp(params, services, mapConfig);
      },
    });

    const mapEmbeddableFactory = new MapEmbeddableFactoryDefinition(async () => {
      const [coreStart, depsStart] = await core.getStartServices();
      const { navigation, data } = depsStart as AppPluginStartDependencies;
      return {
        mapConfig,
        services: {
          ...coreStart,
          navigation,
          toastNotifications: coreStart.notifications.toasts,
          data,
        },
      };
    });

    embeddable.registerEmbeddableFactory(MAP_SAVED_OBJECT_TYPE, mapEmbeddableFactory as any);

    const customSetup = async () => {
      const [coreStart] = await core.getStartServices();
      regionMap.addOptionTab({
        name: 'controls',
        title: i18n.translate('regionMap.mapVis.regionMapEditorConfig.controlTabs.controlsTitle', {
          defaultMessage: 'Import Vector Map',
        }),
        editor: (props: RegionMapVisualizationDependencies) => (
          <OpenSearchDashboardsContextProvider services={coreStart}>
            <VectorUploadOptions {...props} />
          </OpenSearchDashboardsContextProvider>
        ),
      });
    };
    customSetup();

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

  public start(core: CoreStart): CustomImportMapPluginStart {
    return {};
  }

  public stop() {}
}
