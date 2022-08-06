/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { MapsExplorerVisParams } from '../../components/layer_control/layer_configuration_options';
import { WMSConfigurationOptions } from '../../components/layer_control/layers_config_options/wms_configuration_options';
import {DEFAULT_CONFIGURATION_MINZOOM, DEFAULT_CONFIGURATION_MAXZOOM} from "../constants/option"

/**
 * Options which each layer included
 * Each layers hava options: id, name and layerTypes
 */
export interface LayerOptions {
  id: string; // the unique id for the layer instance
  name: string;
  layerType?: LayerTypes;
  typeOptions: LayerTypeOptions;
  isDesatured: boolean;
  isHidden: boolean;
  minZoom: number;
  maxZoom: number;
};

/**
 * Specific layer options for different layer type
 */
export type LayerTypeOptions = {} | WMSConfigurationOptions;

/**
 * LayerTypes which users can choose for every layer
 */
export enum LayerTypes {
  TMSLayer = 'tms_layer',
  WMSLayer = 'wms_layer',
  GeohashLayer = 'geohash_layer',
}

export const DEFAULT_MAP_EXPLORER_VIS_PARAMS: MapsExplorerVisParams = {
  layersOptions: {
    base_roadmap: {
      id: "base_roadmap",
      name: i18n.translate('visTypeMapsExplorerDashboards.defaultLayerName', {
        defaultMessage: 'Base Road Map',
      }),
      layerType: LayerTypes.TMSLayer,
      isDesatured: false,
      isHidden: false,
      minZoom: DEFAULT_CONFIGURATION_MINZOOM,
      maxZoom: DEFAULT_CONFIGURATION_MAXZOOM,
      typeOptions: {}
    }
  },
  layerIdOrder: ["base_roadmap"]
}

export const DEFAULT_NEW_LAYER_OPTIONS: LayerOptions = {
  id: "new_layer",
  name: i18n.translate('layers.defaultNewLayerOptions.name', { defaultMessage: 'New Layer' }),
  isDesatured: false,
  typeOptions: {},
  isHidden: false,
  minZoom: DEFAULT_CONFIGURATION_MINZOOM,
  maxZoom: DEFAULT_CONFIGURATION_MAXZOOM,
} 
