/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { I18nProvider } from '@osd/i18n/react';
import { MapsList, Map } from '../pages/';
import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { APP_PATH } from '../../common/index';

interface MapsDashboardsAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const MapsDashboardsApp = ({ basename, notifications, http }: MapsDashboardsAppDeps) => {
  // Render the application DOM.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <div>
          <Switch>
            <Route path={APP_PATH.CREATE_MAP} render={(props) => <Map />} />
            <Route
              exact
              path="/"
              render={() => <MapsList http={http} notifications={notifications} />}
            />
          </Switch>
        </div>
      </I18nProvider>
    </Router>
  );
};
