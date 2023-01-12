/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters } from '../../../src/core/public';
import { MapServices } from './types';
import { MapsDashboardsApp } from './components/app';
import { OpenSearchDashboardsContextProvider } from '../../../src/plugins/opensearch_dashboards_react/public';
import { ConfigSchema } from '../common/config';

export const renderApp = (
  { element }: AppMountParameters,
  services: MapServices,
  mapConfig: ConfigSchema
) => {
  ReactDOM.render(
    <OpenSearchDashboardsContextProvider services={services}>
      <MapsDashboardsApp mapConfig={mapConfig} />
    </OpenSearchDashboardsContextProvider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
