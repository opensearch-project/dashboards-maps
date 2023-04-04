/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBadge } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import React, { FC } from 'react';

interface Props {
  isDisabled: boolean;
  valueLabel: string;
  onRemove: () => void;
  [propName: string]: any;
}

export const FilterView: FC<Props> = ({
  isDisabled,
  onRemove,
  onClick,
  valueLabel,
  ...rest
}: Props) => {
  let title = i18n.translate('maps.filter.filterBar.moreFilterActionsMessage', {
    defaultMessage: 'Filter: {valueLabel}. Select for more filter actions.',
    values: { valueLabel },
  });

  if (isDisabled) {
    title = `${i18n.translate('maps.filter.filterBar.disabledFilterPrefix', {
      defaultMessage: 'Disabled',
    })} ${title}`;
  }

  return (
    <EuiBadge
      title={title}
      color="hollow"
      iconType="cross"
      iconSide="right"
      closeButtonProps={{
        // Removing tab focus on close button because the same option can be obtained through the context menu
        // Also, we may want to add a `DEL` keyboard press functionality
        tabIndex: -1,
      }}
      iconOnClick={onRemove}
      iconOnClickAriaLabel={i18n.translate('maps.filter.filterBar.filterItemBadgeIconAriaLabel', {
        defaultMessage: 'Delete',
      })}
      onClick={onClick}
      onClickAriaLabel={i18n.translate('maps.filter.filterBar.filterItemBadgeAriaLabel', {
        defaultMessage: 'Filter actions',
      })}
      {...rest}
    >
      {valueLabel}
    </EuiBadge>
  );
};
