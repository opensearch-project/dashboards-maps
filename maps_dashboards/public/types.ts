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

export interface MapsDashboardsPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MapsDashboardsPluginStart {}

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
}
