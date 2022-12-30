/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';

import { EuiFlexItem, EuiFlexGroup, EuiPanel, EuiText, EuiHorizontalRule } from '@elastic/eui';
import { TooltipHeaderContent } from './tooltipHeaderContent';
import { ALL_LAYERS, PageData, TableData, TooltipTable } from './tooltipTable';
import { MapGeoJSONFeature } from 'maplibre-gl';
import { DocumentLayerSpecification } from '../../model/mapLayerType';

export type FeatureGroupItem = {
  features: MapGeoJSONFeature[];
  layer: DocumentLayerSpecification;
};

interface TooltipProps {
  featureGroup: FeatureGroupItem[];
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

function toTable(featureGroupItem: FeatureGroupItem) {
  const table: TableData = [];
  for (const feature of featureGroupItem.features) {
    if (feature?.properties) {
      table.push(featureToTableRow(feature.properties));
    }
  }
  return { table, layer: featureGroupItem.layer.name };
}

function createTableData(featureGroups: FeatureGroupItem[]) {
  return featureGroups.map(toTable);
}

export function TooltipContainer({
  featureGroup,
  onClose,
  showCloseButton = true,
  showPagination = true,
  showLayerSelection = true,
}: TooltipProps) {
  const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<number[]>([0]);
  const tables = useMemo(() => createTableData(featureGroup), [featureGroup]);

  const title = useMemo(() => {
    if (selectedLayerIndexes.includes(ALL_LAYERS)) {
      return 'All layers';
    }
    if (selectedLayerIndexes.length === 1) {
      return tables[selectedLayerIndexes[0]].layer;
    }
    if (selectedLayerIndexes.length > 1) {
      return `${tables[selectedLayerIndexes[0]].layer}, +${tables.length - 1}`;
    }
    return '';
  }, [selectedLayerIndexes, tables]);

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
              onLayerChange={setSelectedLayerIndexes}
              showPagination={showPagination}
              showLayerSelection={showLayerSelection}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiText>
    </EuiPanel>
  );
}
