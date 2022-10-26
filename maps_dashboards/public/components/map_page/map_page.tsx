/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapContainer } from '../map_container';
import { MapTopNavMenu } from '../map_top_nav';

export const MapPage = () => {
  return (
    <div>
      <MapTopNavMenu />
      <MapContainer />
    </div>
  );
};
