/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IndexPattern, AggGroupName, TimeRange } from '../../../../../../src/plugins/data/common';
import { Schema } from '../../../../../../src/plugins/vis_default_editor/public';
import { IAggConfig, IAggType } from '../../../../../../src/plugins/data/public';
import { type DefaultEmptyState } from './cluster_layer_source';

export interface AggCommonProps {
  indexPattern: IndexPattern | null | undefined;
  schemas: Schema[];
  groupName: AggGroupName;
  metricAggs: IAggConfig[];
  setAggParamValue: <T extends keyof IAggConfig['params']>(
    aggId: IAggConfig['id'],
    paramName: T,
    value: IAggConfig['params'][T]
  ) => void;
  onAggTypeChange: (aggId: IAggConfig['id'], aggType: IAggType) => void;
  state: DefaultEmptyState;
  timeRange?: TimeRange;
  formIsTouched: boolean;
}
