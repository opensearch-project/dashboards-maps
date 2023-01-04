/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import {
  CustomImportMapPluginSetup,
  CustomImportMapPluginStart,
  AppPluginSetupDependencies,
} from './types';
import { RegionMapVisualizationDependencies } from '../../../src/plugins/region_map/public';
import { VectorUploadOptions } from './components/vector_upload_options';
import { OpenSearchDashboardsContextProvider } from '../../../src/plugins/opensearch_dashboards_react/public';

export class CustomImportMapPlugin
  implements Plugin<CustomImportMapPluginSetup, CustomImportMapPluginStart> {
  public setup(
    core: CoreSetup,
    { regionMap }: AppPluginSetupDependencies
  ): CustomImportMapPluginSetup {
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
    return {};
  }

  public start(core: CoreStart): CustomImportMapPluginStart {
    return {};
  }

  public stop() {}
}
