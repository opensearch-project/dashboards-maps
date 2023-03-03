/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Filter } from '../../../../src/plugins/data/public';

/* eslint @typescript-eslint/consistent-type-definitions: ["error", "type"] */
export type MapLayerSpecification =
  | OSMLayerSpecification
  | DocumentLayerSpecification
  | CustomLayerSpecification;

export type OSMLayerSpecification = {
  name: string;
  id: string;
  type: 'opensearch_vector_tile_map';
  description: string;
  zoomRange: number[];
  opacity: number;
  visibility: string;
  source: {
    dataURL: string;
  };
  style: {
    styleURL: string;
  };
};

export type DocumentLayerSpecification = {
  name: string;
  id: string;
  type: 'documents';
  description: string;
  zoomRange: number[];
  opacity: number;
  visibility: string;
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
  };
  style: {
    fillColor: string;
    borderColor: string;
    borderThickness: number;
    markerSize: number;
  };
};

export type CustomLayerSpecification = CustomTMSLayerSpecification | CustomWMSLayerSpecification;

export type CustomTMSLayerSpecification = {
  name: string;
  id: string;
  type: 'custom_map';
  description: string;
  zoomRange: number[];
  opacity: number;
  visibility: string;
  source: {
    url: string;
    customType: 'tms';
    attribution: string;
  };
};

export type CustomWMSLayerSpecification = {
  name: string;
  id: string;
  type: 'custom_map';
  description: string;
  zoomRange: number[];
  opacity: number;
  visibility: string;
  source: {
    url: string;
    customType: 'wms';
    attribution: string;
    layers: string;
    styles: string;
    version: string;
    format: string;
    crs: string;
    bbox: string;
  };
};
