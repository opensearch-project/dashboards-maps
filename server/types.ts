/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { HomeServerPluginSetup } from '../../../src/plugins/home/server';
import { DataSourcePluginSetup } from '../../../src/plugins/data_source/server';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginStart {}

export interface AppPluginSetupDependencies {
  home?: HomeServerPluginSetup;
  dataSource: DataSourcePluginSetup;
}
