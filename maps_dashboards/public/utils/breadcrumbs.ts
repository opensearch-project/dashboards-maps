/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { PLUGIN_ID } from '../../common';

export function getMapsLandingBreadcrumbs(navigateToApp: any) {
  return [
    {
      text: i18n.translate('maps.listing.breadcrumb', {
        defaultMessage: 'Maps',
      }),
      onClick: () => navigateToApp(PLUGIN_ID),
    },
  ];
}

export function getCreateBreadcrumbs(navigateToApp: any) {
  return [
    ...getMapsLandingBreadcrumbs(navigateToApp),
    {
      text: i18n.translate('maps.create.breadcrumb', {
        defaultMessage: 'Create',
      }),
    },
  ];
}

export function getSavedMapBreadcrumbs(text: string, navigateToApp: any) {
  return [
    ...getMapsLandingBreadcrumbs(navigateToApp),
    {
      text,
    },
  ];
}
