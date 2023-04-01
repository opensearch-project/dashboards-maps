/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { FilterByPolygon } from './filter_by_polygon';
import { DrawFilterProperties, FILTER_DRAW_MODE } from '../../../../common';
import { FilterByRectangle } from './filter_by_rectangle';

interface SpatialFilterToolBarProps {
  setFilterProperties: (properties: DrawFilterProperties) => void;
  mode: FILTER_DRAW_MODE;
}

export const SpatialFilterToolbar = ({ setFilterProperties, mode }: SpatialFilterToolBarProps) => {
  return (
    <EuiFlexGroup responsive={false} direction="column" alignItems="center" gutterSize="none">
      <EuiFlexItem>
        <FilterByRectangle setDrawFilterProperties={setFilterProperties} mode={mode} />
      </EuiFlexItem>
      <EuiFlexItem>
        <FilterByPolygon setDrawFilterProperties={setFilterProperties} mode={mode} />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
