/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from 'uuid';
import {
  DOCUMENTS,
  DOCUMENTS_DEFAULT_MARKER_SIZE,
  DOCUMENTS_DEFAULT_REQUEST_NUMBER,
  DOCUMENTS_DEFAULT_SHOW_TOOLTIPS,
  DOCUMENTS_DEFAULT_TOOLTIPS,
  LAYER_VISIBILITY,
  MAP_DATA_LAYER_DEFAULT_OPACITY,
  MAP_DEFAULT_MAX_ZOOM,
  MAP_DEFAULT_MIN_ZOOM,
  MAP_LAYER_DEFAULT_BORDER_THICKNESS,
  MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
  MAP_VECTOR_TILE_BASIC_STYLE,
  MAP_VECTOR_TILE_DATA_SOURCE,
  OPENSEARCH_MAP_LAYER,
  CUSTOM_MAP,
} from '../../common';

export const getLayerConfigMap = () => ({
  [OPENSEARCH_MAP_LAYER.type]: {
    name: OPENSEARCH_MAP_LAYER.name,
    description: '',
    type: OPENSEARCH_MAP_LAYER.type,
    id: uuidv4(),
    zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
    opacity: MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
    visibility: LAYER_VISIBILITY.VISIBLE,
    source: {
      dataURL: MAP_VECTOR_TILE_DATA_SOURCE,
    },
    style: {
      styleURL: MAP_VECTOR_TILE_BASIC_STYLE,
    },
  },
  [DOCUMENTS.type]: {
    name: DOCUMENTS.name,
    description: '',
    type: DOCUMENTS.type,
    id: uuidv4(),
    zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
    opacity: MAP_DATA_LAYER_DEFAULT_OPACITY,
    visibility: LAYER_VISIBILITY.VISIBLE,
    source: {
      indexPatternRefName: undefined,
      geoFieldType: undefined,
      geoFieldName: undefined,
      documentRequestNumber: DOCUMENTS_DEFAULT_REQUEST_NUMBER,
      tooltipFields: DOCUMENTS_DEFAULT_TOOLTIPS,
      showTooltips: DOCUMENTS_DEFAULT_SHOW_TOOLTIPS,
    },
    style: {
      ...getStyleColor(),
      borderThickness: MAP_LAYER_DEFAULT_BORDER_THICKNESS,
      markerSize: DOCUMENTS_DEFAULT_MARKER_SIZE,
    },
  },
  //TODO: update custom layer config
  [CUSTOM_MAP.type]: {
    name: CUSTOM_MAP.name,
    description: '',
    type: CUSTOM_MAP.type,
    id: uuidv4(),
    zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
    opacity: MAP_DATA_LAYER_DEFAULT_OPACITY,
    visibility: LAYER_VISIBILITY.VISIBLE,
    source: {
      indexPatternRefName: undefined,
      geoFieldType: undefined,
      geoFieldName: undefined,
      documentRequestNumber: DOCUMENTS_DEFAULT_REQUEST_NUMBER,
      tooltipFields: DOCUMENTS_DEFAULT_TOOLTIPS,
      showTooltips: DOCUMENTS_DEFAULT_SHOW_TOOLTIPS,
    },
    style: {
      ...getStyleColor(),
      borderThickness: MAP_LAYER_DEFAULT_BORDER_THICKNESS,
      markerSize: DOCUMENTS_DEFAULT_MARKER_SIZE,
    },
  },
});

const getInitialColor = () => {
  const colorCode = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + colorCode.slice(0, 6);
};

export const getStyleColor = () => {
  const initialColor = getInitialColor();
  return {
    fillColor: initialColor,
    borderColor: initialColor,
  };
};
