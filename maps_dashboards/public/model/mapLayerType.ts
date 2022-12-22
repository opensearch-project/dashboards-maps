/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Filter } from '../../../../src/plugins/data/public';

/* eslint @typescript-eslint/consistent-type-definitions: ["error", "type"] */
export type MapLayerSpecification = OSMLayerSpecification | DocumentLayerSpecification;

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
    tooltipFields: string[];
    filters: Filter[];
  };
  style: {
    fillColor: string;
    borderColor: string;
    borderThickness: number;
    markerSize: number;
  };
};
