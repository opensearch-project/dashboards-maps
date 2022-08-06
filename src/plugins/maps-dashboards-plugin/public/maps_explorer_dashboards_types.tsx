/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { convertToGeoJson } from '.';
import { truncatedColorSchemas } from '../../../src/plugins/charts/public';
import { Vis } from '../../../src/plugins/visualizations/public';
import { MapsExplorerDashboardsVisualizationDependencies } from './plugin';
import { LayerTypes } from './common/types';
import { MapsExplorerEditorController } from './components/maps_explorer_editor_controller';

export const createMapsExplorerDashboardsVisTypeDefinition = (dependencies: MapsExplorerDashboardsVisualizationDependencies) => {
  const { uiSettings, getServiceSettings } = dependencies;

  return {
    name: 'maps_explorer_dashboards',
    // TODO: Define String ID  'visTypeMapsExplorerDashboards.mapsExplorerDashboardsTitle'
    title: i18n.translate('visTypeMapsExplorerDashboards.mapsExplorerDashboardsTitle', { defaultMessage: 'Maps Explorer' }),
    // TODO: change to the unique icon later
    icon: 'visMapRegion',
    // TODO: Define String ID 'visTypeMapsExplorerDashboards.metricDescription'
    description: i18n.translate('visTypeMapsExplorerDashboards.metricDescription', {
      defaultMessage: 'Add/Remove specific map layers depending on demand.',
    }),
    visualization: dependencies.BaseMapsVisualization,
    responseHandler: convertToGeoJson,
    editor: MapsExplorerEditorController,
    editorConfig: {
      collections: {
        colorSchemas: truncatedColorSchemas,
        layerTypes: [
          {
            value: LayerTypes.TMSLayer,
            text: i18n.translate('mapsExplorer.vis.editorConfig.layerTypes.tmsLayerText', {
              defaultMessage: 'TMS Layer',
            }),
          },
          {
            value: LayerTypes.WMSLayer,
            text: i18n.translate('mapsExplorer.vis.editorConfig.layerTypes.geohashLayerText', {
              defaultMessage: 'WMS Layer',
            }),
          },
        ],
      },
    },
    setup: async (vis: Vis) => {
      let tmsLayers;

      try {
        const serviceSettings = await getServiceSettings();
        tmsLayers = await serviceSettings.getTMSServices();
      } catch (e) {
        return vis;
      }

      vis.type.editorConfig.collections.tmsLayers = tmsLayers;
      if (!vis.params.wms.selectedTmsLayer && tmsLayers.length) {
        vis.params.wms.selectedTmsLayer = tmsLayers[0];
      }
      return vis;
    },
  }
};
