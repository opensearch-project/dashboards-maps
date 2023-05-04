/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect } from 'react';
import { DefaultEditorAggParams } from '../../../../../../src/plugins/vis_default_editor/public';
import { AGGS_ACTION_KEYS, AggsAction } from './agg_group_state';
import { IAggConfig } from '../../../../../../src/plugins/data/public';
import { IndexPattern } from '../../../../../../src/plugins/data/common';
import { AggCommonProps } from './agg_common_props';

interface Props extends AggCommonProps {
  agg: IAggConfig;
  indexPattern: IndexPattern | null | undefined;
  aggIndex: number;
  setAggsState: React.Dispatch<AggsAction>;
}

export const Agg = ({
  agg,
  aggIndex,
  indexPattern,
  schemas,
  groupName,
  metricAggs,
  setAggParamValue,
  onAggTypeChange,
  state,
  setAggsState,
  formIsTouched,
  timeRange,
}: Props) => {
  const aggName = agg?.type?.name;
  const setValidity = useCallback(
    (isValid: boolean) => {
      setAggsState({
        type: AGGS_ACTION_KEYS.VALID,
        payload: isValid,
        aggId: agg.id,
      });
    },
    [agg.id, setAggsState]
  );
  const setTouched = useCallback(
    (touched: boolean) => {
      setAggsState({
        type: AGGS_ACTION_KEYS.TOUCHED,
        payload: touched,
        aggId: agg.id,
      });
    },
    [agg.id, setAggsState]
  );

  // This useEffect is required to update the timeRange value and initiate rerender to keep labels up to date (Issue #57822).
  useEffect(() => {
    if (timeRange && aggName === 'date_histogram') {
      agg?.aggConfigs?.setTimeRange(timeRange);
    }
  }, [agg, aggName, timeRange]);

  //DefaultEditorAggParams needs indexPattern to render,but it can display a fallback state when we pass a fake indexPattern.
  const fallbackIndexPattern = {
    getAggregationRestrictions: () => {
      return undefined;
    },
  } as unknown as IndexPattern;

  return (
    <DefaultEditorAggParams
      className="vbConfig__aggEditor"
      agg={agg}
      aggIndex={aggIndex}
      indexPattern={indexPattern ?? fallbackIndexPattern}
      setValidity={setValidity}
      setTouched={setTouched}
      schemas={schemas}
      formIsTouched={formIsTouched}
      groupName={groupName}
      metricAggs={metricAggs}
      state={state}
      setAggParamValue={setAggParamValue}
      onAggTypeChange={onAggTypeChange}
    />
  );
};
