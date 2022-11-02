/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ILayerConfig {
  name: string;
  id: string;
  type: string;
  iconType: string;
  zoomRange: number[];
  opacity: number;
  visibility: string;
  layerSpec?: any;
  source?: any;
  style?: any;
}
