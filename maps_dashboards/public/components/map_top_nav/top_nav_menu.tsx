/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PLUGIN_ID } from '../../../common';
import { getTopNavConfig } from './get_top_nav_config';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';

export const MapTopNavMenu = () => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    setHeaderActionMenu,
    navigation: {
      ui: { TopNavMenu },
    },
  } = services;
  return (
    <TopNavMenu
      appName={PLUGIN_ID}
      config={getTopNavConfig(services)}
      setMenuMountPoint={setHeaderActionMenu}
    />
  );
};
