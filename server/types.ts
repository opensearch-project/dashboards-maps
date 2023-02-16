/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { HomeServerPluginSetup } from '../../../src/plugins/home/server';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomImportMapPluginStart {}

export interface AppPluginSetupDependencies {
  home?: HomeServerPluginSetup;
}
