/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';

import { EuiFlexItem, EuiFlexGroup, EuiPanel, EuiText, EuiHorizontalRule } from '@elastic/eui';
import { TooltipHeaderContent } from './tooltipHeaderContent';
import { PageData, TableData, TooltipTable } from './tooltipTable';

interface TooltipProps {
  featureGroup: GeoJSON.Feature[][];
  onClose: () => void;
  showCloseButton?: boolean;
  showPagination?: boolean;
  showLayerSelection?: boolean;
}

function featureToTableRow(properties: Record<string, any>) {
  const row: PageData = [];
  for (const [k, v] of Object.entries(properties)) {
    row.push({
      key: k,
      value: `${v}`,
    });
  }
  return row;
}

function toTable(features: GeoJSON.Feature[]) {
  const table: TableData = [];
  for (const feature of features) {
    if (feature?.properties) {
      table.push(featureToTableRow(feature.properties));
    }
  }
  return table;
}

function createTableData(featureGroups: GeoJSON.Feature[][]) {
  return featureGroups.map(toTable);
}

export function TooltipContainer({
  featureGroup,
  onClose,
  showCloseButton = true,
  showPagination = true,
  showLayerSelection = true,
}: TooltipProps) {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const tables = useMemo(() => createTableData(featureGroup), [featureGroup]);

  const title = selectedLayer >= 0 ? `layer-${selectedLayer + 1}` : 'All layers';

  return (
    <EuiPanel style={{ width: 350 }} paddingSize={'s'} grow={true}>
      <EuiText className={'eui-textTruncate'} grow={true}>
        <EuiFlexGroup responsive={false} direction="column" gutterSize="none">
          <EuiFlexItem grow={false}>
            <TooltipHeaderContent
              title={title}
              onClose={onClose}
              showCloseButton={showCloseButton}
            />
            <EuiHorizontalRule margin="xs" />
          </EuiFlexItem>
          <EuiFlexItem grow={true}>
            <TooltipTable
              tables={tables}
              onLayerChange={setSelectedLayer}
              showPagination={showPagination}
              showLayerSelection={showLayerSelection}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiText>
    </EuiPanel>
  );
}
