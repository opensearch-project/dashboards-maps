/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiTextColor } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import React from 'react';

interface Props {
  title: string;
  close: boolean;
  onClose: Function;
}

const TooltipHeaderContent = (props: Props) => {
  return (
    <EuiFlexGroup>
      <EuiFlexItem key="layerName" className="eui-textTruncate">
        <EuiTextColor>
          <h4 className="eui-textTruncate" title={props.title}>
            {props.title}
          </h4>
        </EuiTextColor>
      </EuiFlexItem>
      {props.close && (
        <EuiFlexItem key="closeButton" grow={false}>
          <EuiButtonIcon
            hidden={props.close}
            onClick={() => {
              return props.onClose();
            }}
            iconType="cross"
            aria-label={i18n.translate('maps.tooltip.closeLabel', {
              defaultMessage: 'Close tooltip',
            })}
            data-test-subj="featureTooltipCloseButton"
          />
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  );
};

export { TooltipHeaderContent };
