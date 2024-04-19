/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppMountParameters,
  CoreStart,
  SavedObjectsClient,
  ToastsStart,
  ScopedHistory,
  MountPoint,
} from '../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { DataPublicPluginSetup, DataPublicPluginStart } from '../../../src/plugins/data/public';
import { RegionMapPluginSetup } from '../../../src/plugins/region_map/public';
import { EmbeddableSetup, EmbeddableStart } from '../../../src/plugins/embeddable/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';
import { ConfigSchema } from '../common/config';
import { DataSourceManagementPluginSetup } from '../../../src/plugins/data_source_management/public';

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
  savedObjects: SavedObjectsClient;
  data: DataPublicPluginStart;
  embeddable: EmbeddableStart;
}

export interface MapServices extends CoreStart {
  setHeaderActionMenu: AppMountParameters['setHeaderActionMenu'];
  appBasePath: AppMountParameters['history'];
  element: AppMountParameters['element'];
  navigation: NavigationPublicPluginStart;
  toastNotifications: ToastsStart;
  history: AppMountParameters['history'];
  data: DataPublicPluginStart;
  application: CoreStart['application'];
  i18n: CoreStart['i18n'];
  savedObjects: CoreStart['savedObjects'];
  overlays: CoreStart['overlays'];
  embeddable: EmbeddableStart;
  scopedHistory: ScopedHistory;
  chrome: CoreStart['chrome'];
  uiSettings: CoreStart['uiSettings'];
  mapConfig: ConfigSchema;
  dataSourceManagement: DataSourceManagementPluginSetup;
  setActionMenu: (menuMount: MountPoint | undefined) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginSetup {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginStart {}

export interface AppPluginSetupDependencies {
  regionMap: RegionMapPluginSetup;
  embeddable: EmbeddableSetup;
  visualizations: VisualizationsSetup;
  data: DataPublicPluginSetup;
  dataSourceManagement: DataSourceManagementPluginSetup;
}
