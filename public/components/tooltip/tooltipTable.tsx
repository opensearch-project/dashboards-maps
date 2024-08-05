/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiBasicTable,
  EuiCompressedComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import React, { useState, Fragment, useCallback, useEffect, useMemo } from 'react';

export interface RowData {
  key: string;
  value: string;
}
export type PageData = RowData[];
export type TableData = PageData[];
interface Table {
  table: TableData;
  layer: string;
}

export const ALL_LAYERS = -1;

interface Props {
  tables: Table[];
  onLayerChange?: (layerIndexes: number[]) => void;
  showPagination?: boolean;
  showLayerSelection?: boolean;
}

function mergeTables(tables: Table[], selectedIndex: number[]) {
  const merged: TableData = [];
  const allSelected = selectedIndex.includes(ALL_LAYERS);

  if (!allSelected) {
    for (const index of selectedIndex) {
      merged.push(...tables[index].table);
    }
    return merged;
  }
  for (let i = 0; i < tables.length; i++) {
    const features: PageData[] = [];
    tables[i].table.map((feature) => {
      // Add layer name to every feature as first field
      features.push(
        [
          {
            key: 'Layer name',
            value: tables[i].layer,
          },
        ].concat(feature.slice(0))
      );
    });
    merged.push(...features);
  }
  return merged;
}

const TooltipTable = ({
  tables,
  onLayerChange,
  showPagination = true,
  showLayerSelection = true,
}: Props) => {
  const [selectedLayers, setSelectedLayers] = useState<Array<EuiComboBoxOptionOption<number>>>([
    {
      label: tables[0]?.layer ?? '',
      value: 0,
      key: '0',
    },
  ]);
  const [activePage, setActivePage] = useState<number>(0);
  const columns = [
    {
      field: 'key',
      name: 'Field Name',
      width: '25%',
      truncateText: false,
    },
    {
      field: 'value',
      name: 'Field Value',
      width: '75%',
      truncateText: true,
    },
  ];

  useEffect(() => {
    // When selected layer changed, reset the active page to the first page
    setActivePage(0);
  }, [selectedLayers]);

  const getRowProps = (item) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
    };
  };

  const handleLayerChange = useCallback(
    (layerSelections: Array<EuiComboBoxOptionOption<number>>) => {
      if (tables.length === 0) {
        return;
      }

      const selections = layerSelections;

      setSelectedLayers(selections);
      if (onLayerChange) {
        onLayerChange(selections.map((s) => s.value ?? 0));
      }
    },
    [tables]
  );

  const options = useMemo(() => {
    const layerOptions = [];
    if (tables.length > 1) {
      layerOptions.push({ label: 'All layers', value: ALL_LAYERS, key: '-1' });
    }
    tables.forEach(({ layer }, i) => {
      layerOptions.push({ label: layer, value: i, key: `${i}` });
    });
    return layerOptions;
  }, [tables]);

  const tableItems = useMemo(
    () =>
      mergeTables(
        tables,
        selectedLayers.map((l) => l.value ?? 0)
      ),
    [tables, selectedLayers]
  );
  const pageItems = tableItems[activePage];

  const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      'data-test-subj': `cell-${id}-${field}`,
      className: 'customCellClass',
      textOnly: true,
    };
  };

  return (
    <Fragment>
      <EuiFlexGroup responsive={false}>
        <EuiFlexItem style={{ overflow: 'auto', maxHeight: 300 }}>
          <EuiBasicTable
            isSelectable={false}
            items={pageItems}
            columns={columns}
            tableLayout={'auto'}
            rowProps={getRowProps}
            cellProps={getCellProps}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="s" />
      <EuiFlexGroup justifyContent="spaceAround" alignItems="center" gutterSize="none">
        {showLayerSelection && options?.length > 1 && (
          <EuiFlexItem>
            <EuiCompressedComboBox<number>
              placeholder="Select a layer"
              selectedOptions={selectedLayers}
              singleSelection={{ asPlainText: true }}
              options={options}
              onChange={handleLayerChange}
              isClearable={false}
            />
          </EuiFlexItem>
        )}
        <EuiFlexItem grow={false}>
          {showPagination ? (
            <EuiPagination
              aria-label="Compressed pagination"
              pageCount={tableItems.length}
              activePage={activePage}
              onPageClick={setActivePage}
              compressed
            />
          ) : (
            <EuiText textAlign="center" size="xs">
              {1} of {tableItems.length}
            </EuiText>
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
    </Fragment>
  );
};

export { TooltipTable };
