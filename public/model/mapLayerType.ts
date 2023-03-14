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

export type DataLayerSpecification = DocumentLayerSpecification;

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
  type: 'opensearch_vector_tile_map';
  source: {
    dataURL: string;
  };
  style: {
    styleURL: string;
  };
};

export type DocumentLayerSpecification = AbstractLayerSpecification & {
  type: 'documents';
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
  type: 'custom_map';
  source: {
    url: string;
    customType: 'tms';
    attribution: string;
  };
};

export type CustomWMSLayerSpecification = AbstractLayerSpecification & {
  type: 'custom_map';
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
