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
import React, { useState, Fragment, useCallback } from 'react';

export type RowData = {
  key: string;
  value: string;
};
export type PageData = RowData[];
export type TableData = PageData[];

export const ALL_LAYERS = -1;

interface Props {
  tables: TableData[];
  onLayerChange?: (layer: number) => void;
  showPagination?: boolean;
  showLayerSelection?: boolean;
}

function getLayerLabel(layerIndex: number) {
  if (layerIndex >= 0) {
    return `layer-${layerIndex + 1}`;
  }
  return 'All layers';
}

const TooltipTable = ({
  tables,
  onLayerChange,
  showPagination = true,
  showLayerSelection = true,
}: Props) => {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [activePages, setActivePages] = useState<Record<number, number | undefined>>({});
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

  const getRowProps = (item) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
    };
  };

  const handleLayerChange = useCallback((data: EuiComboBoxOptionOption<number>[]) => {
    if (data.length > 0) {
      const layer = data[0]?.value ?? 0;
      setSelectedLayer(layer);
      if (onLayerChange) {
        onLayerChange(layer);
      }
    }
  }, []);

  const onSelectPage = useCallback(
    (pageIndex) => {
      setActivePages((state) => {
        const newState = { ...state };
        newState[selectedLayer] = pageIndex;
        return newState;
      });
    },
    [selectedLayer]
  );

  const options = [{ label: 'All layers', value: ALL_LAYERS }];
  tables.forEach((_, i) => {
    options.push({ label: `layer-${i + 1}`, value: i });
  });

  const selectedOptions = [{ label: getLayerLabel(selectedLayer), value: selectedLayer }];
  const activePage = activePages[selectedLayer] ?? 0;
  const tableItems = selectedLayer >= 0 ? tables[selectedLayer] : tables.flat();
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
      <EuiFlexGroup justifyContent="spaceAround" alignItems="center">
        {showLayerSelection && (
          <EuiFlexItem>
            <EuiComboBox
              placeholder="Select a layer"
              singleSelection={{ asPlainText: true }}
              selectedOptions={selectedOptions}
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
              onPageClick={onSelectPage}
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
