/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * This file has temporary code for the landing page.
 * Based on the Maps visualization tab, this file will be
 * changed in the future.
 */

import React, { useCallback } from 'react';
import { i18n } from '@osd/i18n';
import { I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContentBody,
} from '@elastic/eui';

import {
  TableListView,
} from '../../../../src/plugins/opensearch_dashboards_react/public';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

interface MapsDashboardsAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const MapsDashboardsApp = ({
  basename,
  notifications,
  http,
  navigation,
}: MapsDashboardsAppDeps) => {
  const find = async (num: number) => {
    let hits: never[] = [];
    await http.post('/api/maps_dashboards/example').then((res) => {
      hits = res.hits;
    });
    return Promise.resolve({
      total: num,
      hits: hits,
    });
  };

  const tableColumns = [
    {
      field: 'title',
      name: i18n.translate('maps.listing.table.titleColumnName', {
        defaultMessage: 'Title',
      }),
      sortable: true,
    },
    {
      field: 'description',
      name: i18n.translate('maps.listing.table.descriptionColumnName', {
        defaultMessage: 'Description',
      }),
      sortable: true,
    },
  ];

  // Render the application DOM.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth="1000px">
            <EuiPageBody component="main">
              <EuiPageContentBody>
                <TableListView
                  headingId="mapsListingHeading"
                  createItem={useCallback(() => {},[])}
                  findItems={find.bind(null, 3)}
                  deleteItems={async() => {await Promise.all([])}}
                  editItem={useCallback(() => {},[])}
                  tableColumns={tableColumns}
                  listingLimit={10}
                  initialPageSize={10}
                  initialFilter={''}
                  noItemsFragment={<div></div>}
                  entityName={i18n.translate('maps.listing.table.entityName', {
                    defaultMessage: 'map',
                  })}
                  entityNamePlural={i18n.translate('maps.listing.table.entityNamePlural', {
                    defaultMessage: 'maps',
                  })}
                  tableListTitle={i18n.translate('maps.listing.table.listTitle', {
                    defaultMessage: 'Maps',
                  })}
                  toastNotifications={notifications.toasts}
                />
              </EuiPageContentBody>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
