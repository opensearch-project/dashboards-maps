/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  EuiSpacer,
  EuiPanel,
  EuiCollapsibleNavGroup,
} from '@elastic/eui';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { TimeRange, IndexPattern } from '../../../../../../src/plugins/data/public';
import { ClusterLayerSpecification } from '../../../model/mapLayerType';
import { DataSourceSection } from './data_source_section';
import { MapServices } from '../../../types';
import { ClusterSection } from './cluster_section';
import { MetricSection } from './metric_section';
import { FilterSection } from './filter_section';

interface Props {
  setSelectedLayerConfig: Function;
  selectedLayerConfig: ClusterLayerSpecification;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
  setIndexPattern: Function;
  timeRange?: TimeRange;
}

const defaultCanUpdateMap = {
  index: false,
  metric: false,
  cluster: false,
};
export type CanUpdateMapType = typeof defaultCanUpdateMap;

export const ClusterLayerSource = ({
                                     setIsUpdateDisabled,
                                     setSelectedLayerConfig,
                                     selectedLayerConfig,
                                     indexPattern,
                                     setIndexPattern,
                                   }: Props) => {
  const {
    services: {
      data: { indexPatterns },
    },
  } = useOpenSearchDashboards<MapServices>();

  const [canUpdateMap, setCanUpdateMap] = useState(defaultCanUpdateMap);

  useEffect(() => {
    const keys = Object.keys(canUpdateMap);
    const canUpdate = keys.every((key) => canUpdateMap[key as keyof CanUpdateMapType]);
    setIsUpdateDisabled(!canUpdate, true);
  }, [canUpdateMap]);

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
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source,
      });
    }
  }, [indexPattern]);

  const commonProps = {
    selectedLayerConfig,
    setSelectedLayerConfig,
    indexPattern,
    setCanUpdateMap,
  };

  const filterPanelInitialIsOpen =
    selectedLayerConfig.source.filters?.length > 0 ||
    selectedLayerConfig.source.useGeoBoundingBoxFilter;

  return (
    <div>
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Data Source"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={true}
        >
          <DataSourceSection
            indexPattern={indexPattern}
            setIndexPattern={setIndexPattern}
            setCanUpdateMap={setCanUpdateMap}
          />
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Cluster"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={true}
        >
          <ClusterSection {...commonProps} />
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Metrics"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={true}
        >
          <MetricSection {...commonProps} />
        </EuiCollapsibleNavGroup>
      </EuiPanel>
      <EuiSpacer size="m" />
      <EuiPanel paddingSize="s">
        <EuiCollapsibleNavGroup
          title="Filters"
          titleSize="xxs"
          isCollapsible={true}
          initialIsOpen={filterPanelInitialIsOpen}
        >
          <FilterSection {...commonProps} />
        </EuiCollapsibleNavGroup>
      </EuiPanel>
    </div>
  );
};
