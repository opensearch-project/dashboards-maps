/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import {
  DRAW_FILTER_POLYGON,
  DRAW_FILTER_POLYGON_DEFAULT_LABEL,
  DRAW_FILTER_RECTANGLE,
  DRAW_FILTER_RECTANGLE_DEFAULT_LABEL,
  DrawFilterProperties,
  FILTER_DRAW_MODE,
} from '../../../../common';
import { FilterByShape } from './filter_by_shape';
import polygonLight from '../../../images/polygon-light.svg';
import polygonDark from '../../../images/polygon-dark.svg';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../../types';

interface SpatialFilterToolBarProps {
  setFilterProperties: (properties: DrawFilterProperties) => void;
  mode: FILTER_DRAW_MODE;
}

export const SpatialFilterToolbar = ({ setFilterProperties, mode }: SpatialFilterToolBarProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const isDarkMode = services.uiSettings.get('theme:darkMode');
  const polygonIcon = isDarkMode ? polygonDark : polygonLight;
  return (
    <EuiFlexGroup responsive={false} direction="column" alignItems="center" gutterSize="none">
      <EuiFlexItem>
        <FilterByShape
          setDrawFilterProperties={setFilterProperties}
          mode={mode}
          shapeMode={FILTER_DRAW_MODE.RECTANGLE}
          shapeLabel={DRAW_FILTER_RECTANGLE}
          defaultLabel={DRAW_FILTER_RECTANGLE_DEFAULT_LABEL}
          iconType={'vector'}
          isDarkMode={isDarkMode}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <FilterByShape
          setDrawFilterProperties={setFilterProperties}
          mode={mode}
          shapeMode={FILTER_DRAW_MODE.POLYGON}
          shapeLabel={DRAW_FILTER_POLYGON}
          defaultLabel={DRAW_FILTER_POLYGON_DEFAULT_LABEL}
          iconType={polygonIcon}
          isDarkMode={isDarkMode}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
