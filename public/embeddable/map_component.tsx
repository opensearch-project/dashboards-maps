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

interface Props {
  embeddable: MapEmbeddable;
  input: MapInput;
  output: EmbeddableOutput;
}
export function MapEmbeddableComponentInner({ embeddable, input, output }: Props) {
  const { savedObjectId } = input;
  const [timeRange, setTimeRange] = useState(input.timeRange);
  const services: MapServices = {
    ...embeddable.getServiceSettings(),
  };

  useEffect(() => {
    setTimeRange(input.timeRange);
  }, [input.timeRange]);

  return (
    <OpenSearchDashboardsContextProvider services={services}>
      <MapComponent
        mapConfig={embeddable.getMapConfig()}
        mapIdFromSavedObject={savedObjectId}
        timeRange={timeRange}
        inDashboardMode={true}
      />
    </OpenSearchDashboardsContextProvider>
  );
}

export const MapEmbeddableComponent = withEmbeddableSubscription<
  MapInput,
  EmbeddableOutput,
  MapEmbeddable
>(MapEmbeddableComponentInner);
