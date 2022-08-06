/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { CoreSetup, CoreStart, IUiSettingsClient, Plugin, PluginInitializerContext } from 'src/core/public';
import {
  createMapsExplorerDashboardsVisTypeDefinition,
} from './maps_explorer_dashboards_types';
import {
  setToasts,
  setUiSettings,
  setOpenSearchDashboardsVersion,
  setMapsExplorerDashboardsConfig,
  setCoreService,
  setFormatService,
  setNotifications,
  setOpenSearchDashboardsLegacy,
  setQueryService,
  setShareService,
} from './maps_explorer_dashboards_services';
import { ExpressionsPublicPlugin } from 'src/plugins/expressions/public';
import { VisualizationsSetup } from 'src/plugins/visualizations/public';
import { createMapsExplorerDashboardsFn } from './maps_explorer_dashboards_fn';
import { BaseMapsVisualizationProvider } from './map/base_maps_visualization';
import { getServiceSettings } from './get_service_settings';
import { MapsExplorerDashboardsConfig } from '../config';
import { IServiceSettings} from '.';
import { OpenSearchDashboardsLegacyStart } from 'src/plugins/opensearch_dashboards_legacy/public';
import { DataPublicPluginStart } from 'src/plugins/data/public';
import { SharePluginStart } from 'src/plugins/share/public';

/**
 * Dependency Data Structure for setup method.
 */
/** @internal */
export interface MapsExplorerDashboardsPluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
}

/**
 * Dependency Data Structure for start method.
 */
/** @internal */
export interface MapsExplorerDashboardsPluginStartDependencies {
  data: DataPublicPluginStart;
  opensearchDashboardsLegacy: OpenSearchDashboardsLegacyStart;
  share: SharePluginStart;
}

/**
 * Return Data Structure for setup method.
 */
export interface MapsExplorerDashboardsPluginSetup {
  config: any;
}

/**
 * Return Data Structure for start method.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MapsExplorerDashboardsPluginStart {}

/** @internal */
export interface MapsExplorerDashboardsVisualizationDependencies {
  uiSettings: IUiSettingsClient;
  config: MapsExplorerDashboardsConfig;
  getServiceSettings: () => Promise<IServiceSettings>;
  BaseMapsVisualization: any;
}

export const bindSetupCoreAndPlugins = (
  core: CoreSetup,
  config: MapsExplorerDashboardsConfig,
  opensearchDashboards: string
) => {
  setToasts(core.notifications.toasts);
  setUiSettings(core.uiSettings);
  setOpenSearchDashboardsVersion(opensearchDashboards);
  setMapsExplorerDashboardsConfig(config);
};

export class MapsExplorerDashboardsPlugin
  implements Plugin<MapsExplorerDashboardsPluginSetup, MapsExplorerDashboardsPluginStart> {
  readonly _initializerContext: PluginInitializerContext<MapsExplorerDashboardsConfig>;

  constructor(initializerContext: PluginInitializerContext) {
    this._initializerContext = initializerContext;
  }
  
  public setup(
    core: CoreSetup,
    { expressions, visualizations }: MapsExplorerDashboardsPluginSetupDependencies
  ) {
    const config = this._initializerContext.config.get<MapsExplorerDashboardsConfig>();
    const opensearchDashboards = this._initializerContext.env.packageInfo.version;

    const visualizationDependencies: Readonly<MapsExplorerDashboardsVisualizationDependencies> = {
      uiSettings: core.uiSettings,
      config: config,
      getServiceSettings: getServiceSettings,
      BaseMapsVisualization: BaseMapsVisualizationProvider(),
    };
  
    bindSetupCoreAndPlugins(core, config, opensearchDashboards);

    expressions.registerFunction(() => createMapsExplorerDashboardsFn());

    visualizations.createBaseVisualization(
      createMapsExplorerDashboardsVisTypeDefinition(visualizationDependencies)
    );

    // Return methods that should be available to other plugins
    return {
      config
    };
  }

  public start(core: CoreStart, plugins: MapsExplorerDashboardsPluginStartDependencies): MapsExplorerDashboardsPluginStart {
    setCoreService(core);
    setFormatService(plugins.data.fieldFormats);
    setQueryService(plugins.data.query);
    setNotifications(core.notifications);
    setOpenSearchDashboardsLegacy(plugins.opensearchDashboardsLegacy);
    setShareService(plugins.share);

    return {};
  }

  public stop() { }
}
