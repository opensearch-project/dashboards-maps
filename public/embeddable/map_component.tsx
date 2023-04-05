/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  withEmbeddableSubscription,
  EmbeddableOutput,
} from '../../../../src/plugins/embeddable/public';
import { MapEmbeddable, MapInput } from './map_embeddable';
import { MapComponent } from '../components/map_page/';
import { OpenSearchDashboardsContextProvider } from '../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../types';
import { TimeRange } from '../../../../src/plugins/data/common';
import { DashboardProps } from '../components/map_page/map_page';

interface Props {
  embeddable: MapEmbeddable;
  input: MapInput;
  output: EmbeddableOutput;
}
export function MapEmbeddableComponentInner({ embeddable, input }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRange | undefined>(input.timeRange);
  const [refreshConfig, setRefreshConfig] = useState(input.refreshConfig);
  const [filters, setFilters] = useState(input.filters);
  const [query, setQuery] = useState(input.query);
  const services: MapServices = {
    ...embeddable.getServiceSettings(),
  };

  useEffect(() => {
    setTimeRange(input.timeRange);
    setRefreshConfig(input.refreshConfig);
    setFilters(input.filters);
    setQuery(input.query);
  }, [input.refreshConfig, input.timeRange, input.filters, input.query]);

  const dashboardProps: DashboardProps = {
    timeRange,
    refreshConfig,
    filters,
    query,
  };

  return (
    <OpenSearchDashboardsContextProvider services={services}>
      <MapComponent
        mapConfig={embeddable.getMapConfig()}
        mapIdFromSavedObject={input.savedObjectId}
        dashboardProps={dashboardProps}
      />
    </OpenSearchDashboardsContextProvider>
  );
}

export const MapEmbeddableComponent = withEmbeddableSubscription<
  MapInput,
  EmbeddableOutput,
  MapEmbeddable
>(MapEmbeddableComponentInner);
