/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useEffect, useReducer } from 'react';
import { EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import { IAggConfig } from '../../../../../../src/plugins/data/public';
import { Agg } from './agg';
import {
  aggGroupReducer,
  initAggsState,
  AGGS_ACTION_KEYS,
  isInvalidAggsTouched,
} from './agg_group_state';
import { AggCommonProps } from './agg_common_props';

interface Props extends AggCommonProps {
  aggs: IAggConfig[];
  setValidity(modelName: string, value: boolean): void;
  setTouched(isTouched: boolean): void;
}

const GROUP_NAME_LABELS = {
  metrics: 'Metrics',
  buckets: 'Cluster',
  none: '',
};

export const AggGroup = ({
  aggs,
  indexPattern,
  schemas,
  groupName,
  setValidity,
  setAggParamValue,
  formIsTouched,
  onAggTypeChange,
  state,
  metricAggs,
  setTouched,
  timeRange,
}: Props) => {
  const schemaNames = schemas.map((s) => s.name);
  const group: IAggConfig[] = useMemo(
    () => aggs.filter((agg: IAggConfig) => agg.schema && schemaNames.includes(agg.schema)) || [],
    [aggs, schemaNames]
  );
  const [aggsState, setAggsState] = useReducer(aggGroupReducer, group, initAggsState);
  const isGroupValid = Object.values(aggsState).every((item) => item.valid);
  const isAllAggsTouched = isInvalidAggsTouched(aggsState);

  useEffect(() => {
    // when isAllAggsTouched is true, it means that all invalid aggs are touched and we will set ngModel's touched to true
    // which indicates that Apply button can be changed to Error button (when all invalid ngModels are touched)
    setTouched(isAllAggsTouched);
  }, [isAllAggsTouched, setTouched]);

  useEffect(() => {
    // when not all invalid aggs are touched and formIsTouched becomes true, it means that Apply button was clicked.
    // and in such case we set touched state to true for all aggs
    if (formIsTouched && !isAllAggsTouched) {
      Object.keys(aggsState).map(([aggId]) => {
        setAggsState({
          type: AGGS_ACTION_KEYS.TOUCHED,
          payload: true,
          aggId,
        });
      });
    }
  }, [formIsTouched]);

  useEffect(() => {
    setValidity(`aggGroup__${groupName}`, isGroupValid);
  }, [groupName, isGroupValid, setValidity]);

  return (
    <>
      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h3>{GROUP_NAME_LABELS[groupName]}</h3>
        </EuiTitle>
        <EuiSpacer size="s" />
        <>
          {group.map((agg: IAggConfig, index: number) => (
            <Agg
              agg={agg}
              aggIndex={index}
              indexPattern={indexPattern}
              schemas={schemas}
              groupName={groupName}
              metricAggs={metricAggs}
              setAggParamValue={setAggParamValue}
              onAggTypeChange={onAggTypeChange}
              state={state}
              setAggsState={setAggsState}
              formIsTouched={aggsState[agg.id] ? aggsState[agg.id].touched : false}
              timeRange={timeRange}
            />
          ))}
        </>
      </EuiPanel>
    </>
  );
};
