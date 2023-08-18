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
} from '../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { DataPublicPluginSetup, DataPublicPluginStart } from '../../../src/plugins/data/public';
import { RegionMapPluginSetup } from '../../../src/plugins/region_map/public';
import { EmbeddableSetup, EmbeddableStart } from '../../../src/plugins/embeddable/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';
import { ConfigSchema } from '../common/config';

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
}
