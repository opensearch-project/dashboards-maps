/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import { EuiFlexItem, EuiFlexGroup, EuiPanel, EuiText, EuiHorizontalRule } from '@elastic/eui';
import { TooltipHeaderContent } from './tooltipHeaderContent';
import { TooltipTable } from './tooltipTable';

export function TooltipContainer(
  title: string,
  features: any[],
  isClickEvent: boolean,
  onClose: Function
) {
  const toTableRows = () => {
    const rows: any[] = [];
    for (const feature of features) {
      rows.push(featureToTableRow(feature?.properties));
    }
    return rows;
  };
  const featureToTableRow = (properties) => {
    const rows: any[] = [];
    for (const [k, v] of Object.entries(properties)) {
      rows.push({
        key: k,
        value: `${v}`,
      });
    }
    return rows;
  };
  return (
    <EuiPanel paddingSize={'s'} grow={true}>
      <EuiText className={'eui-textTruncate'} grow={true}>
        <EuiFlexGroup responsive={false} direction="column" gutterSize="none">
          <EuiFlexItem grow={false}>
            <TooltipHeaderContent title={title} isClickEvent={isClickEvent} onClose={onClose} />
            <EuiHorizontalRule margin="xs" />
          </EuiFlexItem>
          <EuiFlexItem grow={true}>
            <TooltipTable pages={toTableRows()} isClickEvent={isClickEvent} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiText>
    </EuiPanel>
  );
}
