/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiBasicTable,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import React, { useState, Fragment, useCallback, useEffect, useMemo } from 'react';
import { DocumentLayerSpecification } from '../../model/mapLayerType';

export type RowData = {
  key: string;
  value: string;
};
export type PageData = RowData[];
export type TableData = PageData[];
type Table = { table: TableData; layer: DocumentLayerSpecification };

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

  for (let i = 0; i < tables.length; i++) {
    if (allSelected || selectedIndex.includes(i)) {
      merged.push(...tables[i].table);
    }
  }

  return merged;
}

const TooltipTable = ({
  tables,
  onLayerChange,
  showPagination = true,
  showLayerSelection = true,
}: Props) => {
  const [selectedLayers, setSelectedLayers] = useState<EuiComboBoxOptionOption<number>[]>([
    {
      label: tables[0]?.layer.name ?? '',
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
    (layerSelections: EuiComboBoxOptionOption<number>[]) => {
      if (tables.length === 0) {
        return;
      }

      let selections = layerSelections;

      // when cleared selections, automatically select the first layer: value = 0
      if (layerSelections.length === 0) {
        selections = [{ label: tables[0]?.layer.name, value: 0, key: '0' }];
      }

      setSelectedLayers(selections);
      if (onLayerChange) {
        onLayerChange(selections.map((s) => s.value ?? 0));
      }
    },
    [tables]
  );

  const options = useMemo(() => {
    const layerOptions = [{ label: 'All layers', value: ALL_LAYERS, key: '-1' }];
    tables.forEach(({ layer }, i) => {
      layerOptions.push({ label: layer.name, value: i, key: `${i}` });
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
        <EuiFlexItem style={{ overflow: 'scroll', maxHeight: 300 }}>
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
        {showLayerSelection && (
          <EuiFlexItem>
            <EuiComboBox<number>
              placeholder="Select a layer"
              selectedOptions={selectedLayers}
              options={options}
              onChange={handleLayerChange}
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
