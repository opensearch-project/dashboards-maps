/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { FilterByPolygon } from './filter_by_polygon';
import { FILTER_DRAW_MODE, DrawFilterProperties } from '../../../../common';

interface SpatialFilterToolBarProps {
  setFilterProperties: (properties: DrawFilterProperties) => void;
  isDrawActive: boolean;
}

export const SpatialFilterToolbar = ({
  setFilterProperties,
  isDrawActive,
}: SpatialFilterToolBarProps) => {
  const onCancel = () => {
    setFilterProperties({
      mode: FILTER_DRAW_MODE.NONE,
    });
  };
  const filterIconGroups = (
    <EuiFlexItem>
      <FilterByPolygon setDrawFilterProperties={setFilterProperties} isDrawActive={isDrawActive} />
    </EuiFlexItem>
  );
  if (isDrawActive) {
    return (
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiButton fill size="s" onClick={onCancel}>
            {'Cancel'}
          </EuiButton>
        </EuiFlexItem>
        {filterIconGroups}
      </EuiFlexGroup>
    );
  }
  return (
    <EuiFlexGroup responsive={false} direction="column" alignItems="flexStart" gutterSize="s">
      {filterIconGroups}
    </EuiFlexGroup>
  );
};
