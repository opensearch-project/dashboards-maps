/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { EuiSpacer } from '@elastic/eui';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import {
  TimeRange,
  IAggConfig,
  IndexPattern,
  IAggConfigs,
} from '../../../../../../src/plugins/data/public';
import { ClusterLayerSpecification } from '../../../model/mapLayerType';
import { DataSourceSection } from './data_source_section';
import { Schema } from '../../../../../../src/plugins/vis_default_editor/public';
import { AggGroupNames, CreateAggConfigParams } from '../../../../../../src/plugins/data/common';
import { getAggs } from '../../../services';
import { AggGroup } from './agg_group';
import { MapServices } from '../../../types';
import { useEffectOnce } from 'react-use';

import { useEditorFormState } from './form_state';
import { schemas, defaultSchemas, defaultAggs } from './config';
interface Props {
  setSelectedLayerConfig: Function;
  selectedLayerConfig: ClusterLayerSpecification;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
  setIndexPattern: Function;
  timeRange?: TimeRange;
}

const defaultState = {
  data: {},
  description: '',
  title: '',
};
export type DefaultEmptyState = typeof defaultState;

export const ClusterLayerSource = ({
  setIsUpdateDisabled,
  setSelectedLayerConfig,
  selectedLayerConfig,
  indexPattern,
  setIndexPattern,
  timeRange,
}: Props) => {
  const { formState, setTouched, setValidity } = useEditorFormState();
  const {
    services: {
      data: { indexPatterns },
    },
  } = useOpenSearchDashboards<MapServices>();
  const [aggs, setAggs] = useState<IAggConfigs | null>(selectedLayerConfig.source.aggs ?? null);

  //recover state when mount with available aggs
  useEffectOnce(() => {
    if (indexPattern && aggs) {
      setAggs(getAggs().createAggConfigs(indexPattern, aggs.aggs));
    }
  });

  const initDefaultAggs = (indexPattern: IndexPattern) => {
    const metricAggs = getAggs().createAggConfigs(indexPattern, [
      {
        id: '1',
        schema: 'metric',
        type: 'count',
      },
    ]);
    const aggConfig = metricAggs!.createAggConfig({ schema: 'segment' } as CreateAggConfigParams, {
      addToAggConfigs: false,
    });
    aggConfig.brandNew = true;
    const newAggs = [...metricAggs!.aggs, aggConfig];
    setAggs(getAggs().createAggConfigs(indexPattern!, newAggs));
  };
  const responseAggs = useMemo(() => (aggs ? aggs?.getResponseAggs() : []), [aggs]);
  const metricSchemas = (schemas.metrics || []).map((s: Schema) => s.name);
  const metricAggs = useMemo(() => {
    return responseAggs.filter((agg) => agg.schema && metricSchemas.includes(agg.schema));
  }, [responseAggs, metricSchemas]);

  const setAggParamValue = useCallback(
    function <T extends string | number | symbol>(aggId: string, paramName: T, value: any): void {
      const newAggs = aggs!.aggs.map((agg) => {
        if (agg.id === aggId) {
          const parsedAgg = agg.toJSON();

          return {
            ...parsedAgg,
            params: {
              ...parsedAgg.params,
              [paramName]: value,
            },
          };
        }

        return agg;
      });
      setAggs(getAggs().createAggConfigs(indexPattern!, newAggs));
    },
    [aggs, indexPattern]
  );
  useEffect(() => {
    if (aggs) {
      const source = { ...selectedLayerConfig.source, aggs };
      setSelectedLayerConfig({ ...selectedLayerConfig, source });
    }
  }, [aggs]);

  useEffect(() => {
    const selectIndexPattern = async () => {
      if (selectedLayerConfig.source.indexPatternId) {
        const selectedIndexPattern = await indexPatterns.get(
          selectedLayerConfig.source.indexPatternId
        );
        setIndexPattern(selectedIndexPattern);
      }
    };
    selectIndexPattern();
  }, [indexPatterns, selectedLayerConfig.source.indexPatternId]);

  // Handle the side effects of index pattern change
  useEffect(() => {
    const source = { ...selectedLayerConfig.source };
    // when index pattern changed, reset aggs
    if (indexPattern && indexPattern.id !== selectedLayerConfig.source.indexPatternId) {
      source.indexPatternId = indexPattern.id ?? '';
      source.indexPatternRefName = indexPattern.title;
      initDefaultAggs(indexPattern);
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source,
      });
    } else if (
      indexPattern &&
      indexPattern.id === selectedLayerConfig.source.indexPatternId &&
      aggs
    ) {
      // when reenter panel with indexPattern, it will set indexPattern and should create aggs with this indexPattern.
      setAggs(getAggs().createAggConfigs(indexPattern, aggs.aggs));
    }
  }, [indexPattern]);

  const onAggTypeChange = useCallback(
    (aggId: string, aggType: IAggConfig['type']) => {
      const newAggs = aggs!.aggs.map((agg) => {
        if (agg.id === aggId) {
          agg.type = aggType;
          return agg.toJSON();
        }
        return agg;
      });
      setAggs(getAggs().createAggConfigs(indexPattern!, newAggs));
    },
    [aggs, indexPattern]
  );

  useEffect(() => {
    const disableUpdate = formState.invalid || !indexPattern;
    setIsUpdateDisabled(disableUpdate, true);
  }, [formState.invalid, indexPattern]);

  const commonProps = {
    timeRange,
    onAggTypeChange,
    setAggParamValue,
    state: defaultState,
    metricAggs,
    setValidity,
    formIsTouched: formState.touched,
    setTouched,
  };

  return (
    <>
      <DataSourceSection indexPattern={indexPattern} setIndexPattern={setIndexPattern} />
      <EuiSpacer size="s" />
      <AggGroup
        //when no indexpattern, we can't create aggs. So we use a default aggConfig.
        aggs={aggs?.aggs ?? defaultAggs}
        indexPattern={indexPattern}
        //when no indexpattern, we can't create aggs. So we use a default mock schema, this will contain null filters.
        schemas={aggs?.aggs ? schemas.buckets : defaultSchemas.buckets}
        groupName={AggGroupNames.Buckets}
        {...commonProps}
      />
      <EuiSpacer size="s" />
      <AggGroup
        aggs={aggs?.aggs ?? defaultAggs}
        indexPattern={indexPattern}
        schemas={aggs?.aggs ? schemas.metrics : defaultSchemas.metrics}
        groupName={AggGroupNames.Metrics}
        {...commonProps}
      />
      <EuiSpacer size="s" />
    </>
  );
};
