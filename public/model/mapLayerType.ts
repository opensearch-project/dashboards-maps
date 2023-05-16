/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Filter } from '../../../../src/plugins/data/public';
import { DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE, DASHBOARDS_MAPS_LAYER_TYPE } from '../../common';
import {
  MetricAggregations,
  ClusterAggregations,
} from '../components/layer_config/cluster_config/config';

/* eslint @typescript-eslint/consistent-type-definitions: ["error", "type"] */
export type MapLayerSpecification =
  | OSMLayerSpecification
  | DocumentLayerSpecification
  | CustomLayerSpecification
  | ClusterLayerSpecification;

export type DataLayerSpecification = DocumentLayerSpecification | ClusterLayerSpecification;

export type BaseLayerSpecification = OSMLayerSpecification | CustomLayerSpecification;

export type AbstractLayerSpecification = {
  name: string;
  id: string;
  description: string;
  zoomRange: number[];
  opacity: number;
  visibility: string;
};

export type OSMLayerSpecification = AbstractLayerSpecification & {
  type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP;
  source: {
    dataURL: string;
  };
  style: {
    styleURL: string;
  };
};

export type DocumentLayerSpecification = AbstractLayerSpecification & {
  type: DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS;
  source: {
    indexPatternRefName: string;
    indexPatternId: string;
    geoFieldType: 'geo_point' | 'geo_shape';
    geoFieldName: string;
    documentRequestNumber: number;
    showTooltips: boolean;
    displayTooltipsOnHover?: boolean;
    tooltipFields: string[];
    useGeoBoundingBoxFilter: boolean;
    filters: Filter[];
    applyGlobalFilters?: boolean;
  };
  style: {
    fillColor: string;
    borderColor: string;
    borderThickness: number;
    markerSize: number;
    label?: {
      enabled: boolean;
      textByFixed: string;
      textByField: string;
      textType: 'fixed' | 'by_field';
      color: string;
      size: number;
      borderColor: string;
      borderWidth: number;
    };
  };
};

export type CustomLayerSpecification = CustomTMSLayerSpecification | CustomWMSLayerSpecification;

export type CustomTMSLayerSpecification = AbstractLayerSpecification & {
  type: DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP;
  source: {
    url: string;
    customType: DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE.TMS;
    attribution: string;
  };
};

export type CustomWMSLayerSpecification = AbstractLayerSpecification & {
  type: DASHBOARDS_MAPS_LAYER_TYPE.CUSTOM_MAP;
  source: {
    url: string;
    customType: DASHBOARDS_CUSTOM_MAPS_LAYER_TYPE.WMS;
    attribution: string;
    layers: string;
    styles: string;
    version: string;
    format: string;
    crs: string;
    bbox: string;
  };
};

export type ClusterLayerSpecification = AbstractLayerSpecification & {
  type: DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER;
  source: {
    indexPatternRefName: string;
    indexPatternId: string;
    useGeoBoundingBoxFilter: boolean;
    filters: Filter[];
    applyGlobalFilters?: boolean;
    metric: {
      agg: (typeof MetricAggregations)[number]['value'];
      field: string;
      custom_label: string;
      json: string;
    };
    cluster: {
      agg: (typeof ClusterAggregations)[number]['value'];
      field: string;
      json: string;
      custom_label: string;
      useCentroid: boolean;
      changePrecision: boolean;
    };
  };
  style: {
    fillType: 'gradient' | 'solid';
    palette: string;
    fillColor: string;
    borderColor: string;
    borderThickness: number;
    radiusRange: [number, number];
  };
};
