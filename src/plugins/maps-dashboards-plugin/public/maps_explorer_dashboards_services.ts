/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { CoreStart, IToasts, IUiSettingsClient } from 'opensearch-dashboards/public';
import { NotificationsStart } from 'opensearch-dashboards/public';
import { createGetterSetter } from '../../../src/plugins/opensearch_dashboards_utils/public';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { OpenSearchDashboardsLegacyStart } from '../../../src/plugins/opensearch_dashboards_legacy/public';
import { SharePluginStart } from '../../../src/plugins/share/public';
import { MapsExplorerDashboardsConfig } from '../config';


// Maps Legacy Related
let toast: any;
export const setToasts = (notificationToast: IToasts) => (toast = notificationToast);
export const getToasts = () => toast;

let uiSettings: any;
export const setUiSettings = (coreUiSettings: IUiSettingsClient) => (uiSettings = coreUiSettings);
export const getUiSettings = () => uiSettings;

let opensearchDashboards: any;
export const setOpenSearchDashboardsVersion = (version: string) => (opensearchDashboards = version);
export const getOpenSearchDashboardsVersion = () => opensearchDashboards;

let mapsExplorerDashboardsConfig: MapsExplorerDashboardsConfig;
export const setMapsExplorerDashboardsConfig = (config: MapsExplorerDashboardsConfig) => (mapsExplorerDashboardsConfig = config);
export const getMapsExplorerDashboardsConfig = () => mapsExplorerDashboardsConfig;

export const getEmsTileLayerId = () => getMapsExplorerDashboardsConfig().emsTileLayerId;


// Tile Map Related
export const [getCoreService, setCoreService] = createGetterSetter<CoreStart>('Core');

export const [getFormatService, setFormatService] = createGetterSetter<
  DataPublicPluginStart['fieldFormats']
>('data.fieldFormats');

export const [getNotifications, setNotifications] = createGetterSetter<NotificationsStart>(
  'Notifications'
);

export const [getQueryService, setQueryService] = createGetterSetter<
  DataPublicPluginStart['query']
>('Query');

export const [getShareService, setShareService] = createGetterSetter<SharePluginStart>('Share');

export const [getOpenSearchDashboardsLegacy, setOpenSearchDashboardsLegacy] = createGetterSetter<
  OpenSearchDashboardsLegacyStart
>('OpenSearchDashboardsLegacy');
