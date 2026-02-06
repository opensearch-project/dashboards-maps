/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppMountParameters } from '../../../src/core/public';
import { MapServices } from './types';
import { MapsDashboardsApp } from './components/app';
import { OpenSearchDashboardsContextProvider } from '../../../src/plugins/opensearch_dashboards_react/public';

export const renderApp = (
  { element }: AppMountParameters,
  services: MapServices,
) => {
  const root = createRoot(element);
  root.render(
    <OpenSearchDashboardsContextProvider services={services}>
      <MapsDashboardsApp />
    </OpenSearchDashboardsContextProvider>
  );

  return () => root.unmount();
};
