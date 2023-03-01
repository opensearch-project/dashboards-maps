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
  DOCUMENTS_DEFAULT_MARKER_BORDER_THICKNESS,
  MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
  OPENSEARCH_MAP_LAYER,
  CUSTOM_MAP,
  DOCUMENTS_DEFAULT_DISPLAY_TOOLTIPS_ON_HOVER,
  DOCUMENTS_DEFAULT_LABEL_ENABLES,
  DOCUMENTS_DEFAULT_LABEL_VALUE,
  DOCUMENTS_DEFAULT_LABEL_TYPE,
  DOCUMENTS_DEFAULT_LABEL_SIZE,
  DOCUMENTS_DEFAULT_LABEL_COLOR,
  DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR,
  DOCUMENTS_NONE_LABEL_BORDER_WIDTH,
} from '../../common';
import { MapState } from '../model/mapState';
import { ConfigSchema } from '../../common/config';

export const getLayerConfigMap = (mapConfig: ConfigSchema) => ({
  [OPENSEARCH_MAP_LAYER.type]: {
    name: '',
    description: '',
    type: OPENSEARCH_MAP_LAYER.type,
    id: uuidv4(),
    zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
    opacity: MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
    visibility: LAYER_VISIBILITY.VISIBLE,
    source: {
      dataURL: mapConfig.opensearchVectorTileDataUrl,
    },
    style: {
      styleURL: mapConfig.opensearchVectorTileStyleUrl,
    },
  },
  [DOCUMENTS.type]: {
    name: '',
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
      displayTooltipsOnHover: DOCUMENTS_DEFAULT_DISPLAY_TOOLTIPS_ON_HOVER,
    },
    style: {
      ...getStyleColor(),
      borderThickness: DOCUMENTS_DEFAULT_MARKER_BORDER_THICKNESS,
      markerSize: DOCUMENTS_DEFAULT_MARKER_SIZE,
      enableLabel: DOCUMENTS_DEFAULT_LABEL_ENABLES,
      labelTittle: DOCUMENTS_DEFAULT_LABEL_VALUE,
      labelTittleType: DOCUMENTS_DEFAULT_LABEL_TYPE,
      labelSize: DOCUMENTS_DEFAULT_LABEL_SIZE,
      labelBorderWidth: DOCUMENTS_NONE_LABEL_BORDER_WIDTH,
      labelColor: DOCUMENTS_DEFAULT_LABEL_COLOR,
      labelBorderColor: DOCUMENTS_DEFAULT_LABEL_BORDER_COLOR,
    },
  },
  [CUSTOM_MAP.type]: {
    name: '',
    description: '',
    type: CUSTOM_MAP.type,
    id: uuidv4(),
    zoomRange: [MAP_DEFAULT_MIN_ZOOM, MAP_DEFAULT_MAX_ZOOM],
    opacity: MAP_REFERENCE_LAYER_DEFAULT_OPACITY,
    visibility: LAYER_VISIBILITY.VISIBLE,
    source: {
      url: '',
      customType: 'wms',
      attribution: '',
      layers: '',
      styles: '',
      version: '',
      format: '',
      crs: '',
      bbox: '',
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

export const getInitialMapState = (): MapState => {
  const timeRange = {
    from: 'now-15m',
    to: 'now',
  };
  const query = {
    query: '',
    language: 'kuery',
  };
  const refreshInterval = {
    pause: true,
    value: 12000,
  };
  return {
    timeRange,
    query,
    refreshInterval,
  };
};
