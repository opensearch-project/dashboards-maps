/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.scss';

import { MapsExplorerDashboardsPlugin } from './plugin';

// @ts-ignore
import { PluginInitializerContext } from 'opensearch-dashboards/public';
// @ts-ignore
import * as colorUtil from './map/color_util';
// @ts-ignore
import { OpenSearchDashboardsMapLayer } from './map/layer/opensearch_dashboards_map_layer';
// @ts-ignore
import { convertToGeoJson } from './map/convert_to_geojson';
// @ts-ignore
import { getPrecision, geoContains } from './map/decode_geo_hash';
import {
  VectorLayer,
  FileLayerField,
  FileLayer,
  TmsLayer,
  IServiceSettings,
} from './map/service_settings_types';
// @ts-ignore
import { mapTooltipProvider } from './tooltip_provider';

import './map/index.scss';

/** @public */
export {
  getPrecision,
  geoContains,
  colorUtil,
  convertToGeoJson,
  IServiceSettings,
  OpenSearchDashboardsMapLayer,
  VectorLayer,
  FileLayerField,
  FileLayer,
  TmsLayer,
  mapTooltipProvider,
};

export * from './common/types';
export { ORIGIN } from './common/constants/origin';

export { lazyLoadMapsExplorerDashboardsModules } from './lazy_load_bundle';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin(initializerContext: PluginInitializerContext) {
  return new MapsExplorerDashboardsPlugin(initializerContext);
}