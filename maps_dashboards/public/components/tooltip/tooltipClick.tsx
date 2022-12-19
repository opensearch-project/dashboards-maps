import React from 'react';

import { EuiFlexItem, EuiFlexGroup, EuiPanel, EuiText, EuiSpacer } from '@elastic/eui';
import { TooltipHeaderContent } from './tooltipHeaderContent';
import { TooltipTable } from './tooltipTable';

export function TooltipClick(title: string, features: any[], onClose: Function) {
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
    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiPanel paddingSize={'s'}>
          <EuiText>
            <TooltipHeaderContent title={title} close={true} onClose={onClose} />
            <EuiSpacer size="xs" />
            <TooltipTable pages={toTableRows()} />
          </EuiText>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
