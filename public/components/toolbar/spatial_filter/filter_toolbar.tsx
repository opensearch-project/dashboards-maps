/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { FilterByPolygon } from './filter_by_polygon';
import { DrawFilterProperties } from '../../../../common';
import { FilterByRectangle } from './filter_by_rectangle';

interface SpatialFilterToolBarProps {
  setFilterProperties: (properties: DrawFilterProperties) => void;
  isDrawActive: boolean;
}

export const SpatialFilterToolbar = ({
  setFilterProperties,
  isDrawActive,
}: SpatialFilterToolBarProps) => {
  const filterIconGroups = (
    <EuiFlexItem>
      <FilterByPolygon setDrawFilterProperties={setFilterProperties} isDrawActive={isDrawActive} />
      <FilterByRectangle
        setDrawFilterProperties={setFilterProperties}
        isDrawActive={isDrawActive}
      />
    </EuiFlexItem>
  );
  return (
    <EuiFlexGroup responsive={false} direction="column" alignItems="flexStart" gutterSize="s">
      {filterIconGroups}
    </EuiFlexGroup>
  );
};
