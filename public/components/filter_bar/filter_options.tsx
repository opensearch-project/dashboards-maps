/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiSmallButtonIcon, EuiContextMenu, EuiPopover, EuiPopoverTitle } from '@elastic/eui';
import React, { useState } from 'react';
import { i18n } from '@osd/i18n';

interface Props {
  onEnableAll: () => void;
  onDisableAll: () => void;
  onToggleAllNegated: () => void;
  onToggleAllDisabled: () => void;
  onRemoveAll: () => void;
}

export const FilterOptions = ({
  onEnableAll,
  onDisableAll,
  onToggleAllNegated,
  onToggleAllDisabled,
  onRemoveAll,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };
  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const panelTree = {
    id: 0,
    items: [
      {
        name: i18n.translate('maps.filter.options.enableAllFiltersButtonLabel', {
          defaultMessage: 'Enable all',
        }),
        icon: 'eye',
        onClick: () => {
          closePopover();
          onEnableAll();
        },
        'data-test-subj': 'enableAllFilters',
      },
      {
        name: i18n.translate('maps.filter.options.disableAllFiltersButtonLabel', {
          defaultMessage: 'Disable all',
        }),
        icon: 'eyeClosed',
        onClick: () => {
          closePopover();
          onDisableAll();
        },
        'data-test-subj': 'disableAllFilters',
      },
      {
        name: i18n.translate('maps.filter.options.invertNegatedFiltersButtonLabel', {
          defaultMessage: 'Invert inclusion',
        }),
        icon: 'invert',
        onClick: () => {
          closePopover();
          onToggleAllNegated();
        },
        'data-test-subj': 'invertInclusionAllFilters',
      },
      {
        name: i18n.translate('maps.filter.options.invertDisabledFiltersButtonLabel', {
          defaultMessage: 'Invert enabled/disabled',
        }),
        icon: 'eye',
        onClick: () => {
          closePopover();
          onToggleAllDisabled();
        },
        'data-test-subj': 'invertEnableDisableAllFilters',
      },
      {
        name: i18n.translate('maps.filter.options.deleteAllFiltersButtonLabel', {
          defaultMessage: 'Remove all',
        }),
        icon: 'trash',
        onClick: () => {
          closePopover();
          onRemoveAll();
        },
        'data-test-subj': 'removeAllFilters',
      },
    ],
  };

  return (
    <EuiPopover
      id="popoverForAllFilters"
      className="globalFilterGroup__allFiltersPopover"
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      button={
        <EuiSmallButtonIcon
          onClick={togglePopover}
          iconType="filter"
          aria-label={i18n.translate('maps.filter.options.changeAllFiltersButtonLabel', {
            defaultMessage: 'Change all filters',
          })}
          title={i18n.translate('maps.filter.options.changeAllFiltersButtonLabel', {
            defaultMessage: 'Change all filters',
          })}
          data-test-subj="showFilterActions"
        />
      }
      anchorPosition="rightUp"
      panelPaddingSize="none"
      repositionOnScroll
    >
      <EuiPopoverTitle>
        {i18n.translate('maps.filter.changeAllFiltersTitle', {
          defaultMessage: 'Change all filters',
        })}
      </EuiPopoverTitle>
      <EuiContextMenu initialPanelId={0} panels={[panelTree]} />
    </EuiPopover>
  );
};
