/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import React, { useCallback } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { EuiPage, EuiPageBody, EuiPageContentBody } from '@elastic/eui';
import { CoreStart } from 'opensearch-dashboards/public';
import { TableListView } from '../../../../../src/plugins/opensearch_dashboards_react/public';

export const MapsList = (props: {
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
}) => {
  const { http } = props;
  const find = async (num: number) => {
    const res = await http.post('/api/maps-dashboards/example');
    return {
      total: num,
      hits: res.hits,
    };
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

  const createItem = useCallback(() => {
    window.location.href = http.basePath.prepend('/app/maps-dashboards/#/create-map');
  }, [http.basePath]);

  const findItem = find.bind(null, 3);

  const deleteItems = async () => {
    await Promise.all([]);
  };

  const editItem = useCallback(() => {}, []);

  // Render the map list DOM.
  return (
    <I18nProvider>
      <>
        <EuiPage restrictWidth="1000px">
          <EuiPageBody component="main">
            <EuiPageContentBody>
              <TableListView
                headingId="mapsListingHeading"
                createItem={createItem}
                findItems={findItem}
                deleteItems={deleteItems}
                editItem={editItem}
                tableColumns={tableColumns}
                listingLimit={10}
                initialPageSize={10}
                initialFilter={''}
                noItemsFragment={<div />}
                entityName={i18n.translate('maps.listing.table.entityName', {
                  defaultMessage: 'map',
                })}
                entityNamePlural={i18n.translate('maps.listing.table.entityNamePlural', {
                  defaultMessage: 'maps',
                })}
                tableListTitle={i18n.translate('maps.listing.table.listTitle', {
                  defaultMessage: 'Maps',
                })}
                toastNotifications={props.notifications.toasts}
              />
            </EuiPageContentBody>
          </EuiPageBody>
        </EuiPage>
      </>
    </I18nProvider>
  );
};
