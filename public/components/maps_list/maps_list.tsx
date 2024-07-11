/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import React, { useCallback, useEffect } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContentBody,
  EuiLink,
  EuiSmallButton,
  EuiPageHeader,
} from '@elastic/eui';
import {
  TableListView,
  useOpenSearchDashboards,
} from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { MapServices } from '../../types';
import { getMapsLandingBreadcrumbs } from '../../utils/breadcrumbs';
import { APP_PATH, MAPS_APP_ID } from '../../../common';
import { DataSourceAggregatedViewConfig } from '../../../../../src/plugins/data_source_management/public';

export const MapsList = () => {
  const {
    services: {
      notifications,
      savedObjects: { client: savedObjectsClient },
      application: { navigateToApp },
      chrome: { docTitle, setBreadcrumbs },
      dataSourceManagement,
      setActionMenu,
    },
  } = useOpenSearchDashboards<MapServices>();

  useEffect(() => {
    setBreadcrumbs(getMapsLandingBreadcrumbs(navigateToApp));
    docTitle.change(i18n.translate('maps.listing.pageTitle', { defaultMessage: 'Maps' }));
  }, [docTitle, navigateToApp, setBreadcrumbs]);

  const navigateToSavedMapPage = (id: string) => {
    navigateToApp(MAPS_APP_ID, { path: `/${id}` });
  };

  const tableColumns = [
    {
      field: 'attributes.title',
      name: i18n.translate('maps.listing.table.titleColumnName', {
        defaultMessage: 'Title',
      }),
      sortable: true,
      render: (title: string, record: any) => (
        <EuiLink onClick={() => navigateToSavedMapPage(record.id)}>{title}</EuiLink>
      ),
    },
    {
      field: 'attributes.description',
      name: i18n.translate('maps.listing.table.descriptionColumnName', {
        defaultMessage: 'Description',
      }),
      sortable: true,
    },
    {
      field: 'updated_at',
      name: i18n.translate('maps.listing.table.updatedTimeColumnName', {
        defaultMessage: 'Last updated',
      }),
      sortable: true,
    },
  ];

  const navigateToCreateMapPage = () => {
    navigateToApp(MAPS_APP_ID, { path: APP_PATH.CREATE_MAP });
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
        notifications.toasts.addError(error, {
          title: i18n.translate('map.mapListingDeleteErrorTitle', {
            defaultMessage: 'Error deleting map',
          }),
        });
      });
    },
    [savedObjectsClient, notifications.toasts]
  );

  const noMapItem = (
    <EuiPageHeader
      pageTitle="Create your first map"
      description="There is no map to display, let's create your first map."
      rightSideItems={[
        <EuiSmallButton fill onClick={navigateToCreateMapPage}>
          Create map
        </EuiSmallButton>,
      ]}
    />
  );
  const dataSourceManagementEnabled: boolean = !!dataSourceManagement;

  return (
    <I18nProvider>
      <>
        <EuiPage restrictWidth="1000px">
          <EuiPageBody component="main" data-test-subj="mapListingPage">
            <EuiPageContentBody>
              {dataSourceManagementEnabled && (() => {
                const DataSourcesMenu = dataSourceManagement.ui.getDataSourceMenu<DataSourceAggregatedViewConfig>();
                return (
                  <DataSourcesMenu
                    setMenuMountPoint={setActionMenu}
                    componentType={'DataSourceAggregatedView'}
                    componentConfig={{
                      savedObjects: savedObjectsClient,
                      notifications,
                      fullWidth: true,
                      displayAllCompatibleDataSources: true,
                    }}
                  />
                );
              })()}
              <TableListView
                headingId="mapsListingHeading"
                createItem={navigateToCreateMapPage}
                findItems={fetchMaps}
                deleteItems={deleteMaps}
                tableColumns={tableColumns}
                listingLimit={10}
                initialPageSize={10}
                initialFilter={''}
                noItemsFragment={noMapItem}
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
  );
};
