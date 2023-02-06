/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { I18nProvider } from '@osd/i18n/react';
import { MapsList } from './maps_list';
import { MapPage } from './map_page';
import { APP_PATH } from '../../common';
import { useOpenSearchDashboards } from '../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../types';
import { ConfigSchema } from '../../common/config';

interface Props {
  mapConfig: ConfigSchema;
}
export const MapsDashboardsApp = ({ mapConfig }: Props) => {
  const {
    services: { appBasePath },
  } = useOpenSearchDashboards<MapServices>();
  // Render the application DOM.
  return (
    <Router history={appBasePath}>
      <I18nProvider>
        <Switch>
          <Route
            path={[APP_PATH.CREATE_MAP, APP_PATH.EDIT_MAP]}
            render={() => <MapPage mapConfig={mapConfig} />}
          />
          <Route exact path={APP_PATH.LANDING_PAGE_PATH} render={() => <MapsList />} />
        </Switch>
      </I18nProvider>
    </Router>
  );
};
