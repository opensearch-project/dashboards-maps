import { EuiBasicTable, EuiFlexGroup, EuiFlexItem, EuiPagination } from '@elastic/eui';
import React, { useState } from 'react';

interface Props {
  pages: any[];
}

const TooltipTable = (props: Props) => {
  const [activePage, setActivePage] = useState(0);
  const PAGE_COUNT = props.pages.length;
  const columns = [
    {
      field: 'key',
      name: 'Field Name',
      width: '100%',
      truncateText: false,
    },
    {
      field: 'value',
      name: 'Field Value',
      width: '100%',
      truncateText: false,
    },
  ];

  const getRowProps = (item) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
    };
  };

  const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };
  return (
    <div>
      <EuiFlexGroup alignItems={'flexStart'} responsive={false}>
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
      <EuiFlexGroup alignItems="flexEnd" responsive={false} justifyContent="spaceAround">
        <EuiFlexItem grow={false}>
          <EuiPagination
            aria-label="Compressed pagination"
            pageCount={PAGE_COUNT}
            activePage={activePage}
            onPageClick={(pageIndex) => setActivePage(pageIndex)}
            compressed
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};

export { TooltipTable };
