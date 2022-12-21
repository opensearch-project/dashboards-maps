/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTable, EuiFlexGroup, EuiFlexItem, EuiPagination, EuiText } from '@elastic/eui';
import React, { useState, Fragment } from 'react';

interface Props {
  pages: any[];
  isClickEvent: boolean;
}

const TooltipTable = (props: Props) => {
  const [activePage, setActivePage] = useState(0);
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

  const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      'data-test-subj': `cell-${id}-${field}`,
      className: 'customCellClass',
      textOnly: true,
    };
  };
  const buildMessage = (count: number) => {
    return (
      <EuiText textAlign="center" size="xs">
        {1} of {count}
      </EuiText>
    );
  };

  const buildPagination = (count: number) => {
    return (
      <EuiPagination
        aria-label="Compressed pagination"
        pageCount={count}
        activePage={activePage}
        onPageClick={(pageIndex) => setActivePage(pageIndex)}
        compressed
      />
    );
  };

  return (
    <Fragment>
      <EuiFlexGroup responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiBasicTable
            isSelectable={false}
            items={props.pages[activePage]}
            columns={columns}
            tableLayout={'auto'}
            rowProps={getRowProps}
            cellProps={getCellProps}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={false}>
          {props.isClickEvent
            ? buildPagination(props.pages.length)
            : buildMessage(props.pages.length)}
        </EuiFlexItem>
      </EuiFlexGroup>
    </Fragment>
  );
};

export { TooltipTable };
