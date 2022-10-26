/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import React, { useCallback } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { EuiPage, EuiPageBody, EuiPageContentBody } from '@elastic/eui';
import {
  TableListView,
  useOpenSearchDashboards,
} from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { MapServices } from '../../types';

export const MapsList = () => {
  const {
    services: {
      notifications: { toasts },
      http: { basePath },
      savedObjects: { client: savedObjectsClient },
      application: { navigateToUrl },
    },
  } = useOpenSearchDashboards<MapServices>();
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
    navigateToUrl(basePath.prepend('/app/maps-dashboards/create-map'));
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
                createItem={createMap}
                findItems={fetchMaps}
                deleteItems={deleteMaps}
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
                toastNotifications={toasts}
              />
            </EuiPageContentBody>
          </EuiPageBody>
        </EuiPage>
      </>
    </I18nProvider>
  );
};
