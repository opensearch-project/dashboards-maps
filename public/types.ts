/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppMountParameters,
  CoreStart,
  SavedObjectsClient,
  ToastsStart,
} from 'opensearch-dashboards/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';

import { RegionMapPluginSetup } from '../../../src/plugins/region_map/public';
import { EmbeddableSetup } from '../../../src/plugins/embeddable/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
  savedObjects: SavedObjectsClient;
  data: DataPublicPluginStart;
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
  savedObjects: SavedObjectsClient;
  overlays: CoreStart['overlays'];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginSetup {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface AppPluginSetupDependencies {
  regionMap: RegionMapPluginSetup;
  embeddable: EmbeddableSetup;
  visualizations: VisualizationsSetup;
}
