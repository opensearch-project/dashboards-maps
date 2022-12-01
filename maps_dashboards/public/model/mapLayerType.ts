/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint @typescript-eslint/consistent-type-definitions: ["error", "type"] */
export type MapLayerSpecification = OSMLayerSpecification | DocumentLayerSpecification;

export type OSMLayerSpecification = {
  name: string;
  id: string;
  type: 'opensearch_vector_tile_map';
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
  zoomRange: number[];
  opacity: number;
  visibility: string;
  source: {
    indexPatternRefName: string;
    indexPatternId?: string;
    geoFiledType: 'geo_point' | 'geo_shape';
    geoFieldName: string;
    documentRequestNumber: number;
  };
  style: {
    fillColor: string;
  };
};
