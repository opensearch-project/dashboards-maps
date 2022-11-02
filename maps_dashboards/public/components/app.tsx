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

export const MapsDashboardsApp = () => {
  const {
    services: { appBasePath },
  } = useOpenSearchDashboards<MapServices>();
  // Render the application DOM.
  return (
    <Router history={appBasePath}>
      <I18nProvider>
        <div>
          <Switch>
            <Route path={[APP_PATH.CREATE_MAP, APP_PATH.SAVED_MAP]} render={() => <MapPage />} />
            <Route exact path="/" render={() => <MapsList />} />
          </Switch>
        </div>
      </I18nProvider>
    </Router>
  );
};
