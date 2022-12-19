import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiTextColor,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import React, { CSSProperties } from 'react';

interface Props {
  title: string;
  close: boolean;
  onClose: Function;
}

const TooltipHeaderContent = (props: Props) => {
  const style: CSSProperties = {
    width: '10px',
  };
  return (
    <div>
      <EuiFlexGroup alignItems="center" gutterSize="xs">
        <EuiFlexItem grow={true} key="layerName" style={style}>
          <EuiTextColor>
            <h4 className="eui-textTruncate" title={props.title}>
              {props.title}
            </h4>
          </EuiTextColor>
        </EuiFlexItem>
        {props.close && (
          <EuiFlexItem grow={false} key="closeButton">
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
      <EuiHorizontalRule margin="xs" />
    </div>
  );
};

export { TooltipHeaderContent };
