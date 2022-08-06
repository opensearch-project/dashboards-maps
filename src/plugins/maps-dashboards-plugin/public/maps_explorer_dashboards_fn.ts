/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { get } from 'lodash';
import { i18n } from '@osd/i18n';
import {
  ExpressionFunctionDefinition,
  OpenSearchDashboardsDatatable,
  Render,
} from 'src/plugins/expressions/public';
import { convertToGeoJson } from '.';

interface Arguments {
  // expression: string;
  // interval: string;
  visConfig: string;
}

interface RenderValue {
  visType: 'maps_explorer_dashboards';
  visConfig: Arguments;
}

export type MapsExplorerDashboardsExpressionFunctionDefinition = ExpressionFunctionDefinition<
  'maps_explorer_dashboards',
  OpenSearchDashboardsDatatable,
  Arguments,
  Render<RenderValue>
>;

export const createMapsExplorerDashboardsFn = (): MapsExplorerDashboardsExpressionFunctionDefinition => ({
  name: 'maps_explorer_dashboards',
  type: 'render',
  context: {
    types: ['opensearch_dashboards_datatable'],
  },
  //TODO: update the string ID
  help: i18n.translate('mapsExplorerDashboards.function.help', {
    defaultMessage: 'Maps Explorer Dashboards visualization',
  }),
  args: {
    visConfig: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
  },
  fn(context, args) {
    const visConfig = JSON.parse(args.visConfig);
    const { geohash, metric, geocentroid } = visConfig.dimensions;
    const convertedData = convertToGeoJson(context, {
      geohash,
      metric,
      geocentroid,
    });

    if (geohash && geohash.accessor) {
      convertedData.meta.geohash = context.columns[geohash.accessor].meta;
    }

    return {
      type: 'render',
      as: 'visualization',
      value: {
        visData: convertedData,
        visType: 'maps_explorer_dashboards',
        visConfig,
        params: {
          listenOnChange: true,
        },
      },
    };
  },
});
