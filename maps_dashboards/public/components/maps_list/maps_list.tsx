/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import React, { useCallback, useEffect } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { EuiPage, EuiPageBody, EuiPageContentBody } from '@elastic/eui';
import {
  TableListView,
  useOpenSearchDashboards,
} from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { MapServices } from '../../types';
import { getMapsLandingBreadcrumbs } from '../../utils/breadcrumbs';
import { PLUGIN_ID, APP_PATH } from '../../../common';

export const MapsList = () => {
  const {
    services: {
      notifications: { toasts },
      savedObjects: { client: savedObjectsClient },
      application: { navigateToApp },
      chrome: { docTitle, setBreadcrumbs },
    },
  } = useOpenSearchDashboards<MapServices>();

  useEffect(() => {
    setBreadcrumbs(getMapsLandingBreadcrumbs(navigateToApp));
    docTitle.change(i18n.translate('maps.listing.pageTitle', { defaultMessage: 'Maps' }));
  }, [docTitle, navigateToApp, setBreadcrumbs]);

  const tableColumns = [
    {
      field: 'attributes.title',
      name: i18n.translate('maps.listing.table.titleColumnName', {
        defaultMessage: 'Title',
      }),
      sortable: true,
    },
    {
      field: 'attributes.description',
      name: i18n.translate('maps.listing.table.descriptionColumnName', {
        defaultMessage: 'Description',
      }),
      sortable: true,
    },
  ];

  const createMap = () => {
    navigateToApp(PLUGIN_ID, { path: APP_PATH.CREATE_MAP });
  };

  const fetchMaps = useCallback(async (): Promise<{
    total: number;
    hits: object[];
  }> => {
    const res = await savedObjectsClient.find<MapSavedObjectAttributes>({
      type: 'map',
      fields: ['description', 'title'],
    });
    return {
      total: res.total,
      hits: res.savedObjects,
    };
  }, [savedObjectsClient]);

  const deleteMaps = useCallback(
    async (selectedItems: object[]) => {
      await Promise.all(
        selectedItems.map((item: any) => savedObjectsClient.delete(item.type, item.id))
      ).catch((error) => {
        toasts.addError(error, {
          title: i18n.translate('map.mapListingDeleteErrorTitle', {
            defaultMessage: 'Error deleting map',
          }),
        });
      });
    },
    [savedObjectsClient, toasts]
  );

  const editMap = useCallback(
    ({ id }) => {
      if (id) {
        navigateToApp(PLUGIN_ID, { path: `/${id}` });
        return;
      }
    },
    [navigateToApp]
  );

  // Render the map list DOM.
  return (
    <I18nProvider>
      <>
        <EuiPage restrictWidth="1000px">
          <EuiPageBody component="main">
            <EuiPageContentBody>
              <TableListView
                headingId="mapsListingHeading"
                createItem={createMap}
                findItems={fetchMaps}
                deleteItems={deleteMaps}
                editItem={editMap}
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
                toastNotifications={toasts}
              />
            </EuiPageContentBody>
          </EuiPageBody>
        </EuiPage>
      </>
    </I18nProvider>
  );
};
