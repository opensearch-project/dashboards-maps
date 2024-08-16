/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiContextMenu, EuiPopover } from '@elastic/eui';
import classNames from 'classnames';
import React, { MouseEvent, useState } from 'react';
import { i18n } from '@osd/i18n';
import { GeoShapeFilterMeta } from '../../../../../src/plugins/data/common';
import { FilterView } from './filter_view';
import {
  toggleGeoShapeFilterMetaDisabled,
  toggleGeoShapeFilterMetaNegated,
} from './filter_actions';
import { FilterEditor } from './filter_editor';

interface Props {
  id: string;
  filterMeta: GeoShapeFilterMeta;
  className?: string;
  onUpdate: (filter: GeoShapeFilterMeta) => void;
  onRemove: () => void;
}

export function FilterItem({ filterMeta, onUpdate, onRemove, id, className }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  function onSubmit(content: string, label: string) {
    setIsPopoverOpen(false);
    const updatedFilter: GeoShapeFilterMeta = {
      ...filterMeta,
      params: JSON.parse(content),
      alias: label,
    };
    onUpdate(updatedFilter);
  }

  function handleClick(e: MouseEvent<HTMLInputElement>) {
    if (e.shiftKey) {
      onToggleDisabled();
    } else {
      setIsPopoverOpen(!isPopoverOpen);
    }
  }

  function onToggleNegated() {
    const f = toggleGeoShapeFilterMetaNegated(filterMeta);
    onUpdate(f);
  }

  function onToggleDisabled() {
    const f = toggleGeoShapeFilterMetaDisabled(filterMeta);
    onUpdate(f);
  }

  function getClasses(negate: boolean, disabled: boolean) {
    return classNames(
      'globalFilterItem',
      {
        'globalFilterItem-isDisabled': disabled,
        'globalFilterItem-isExcluded': negate,
      },
      className
    );
  }

  function getDataTestSubj() {
    const dataTestSubjKey = filterMeta.key ? `filter-key-${filterMeta.key}` : '';
    const dataTestSubjValue = filterMeta.value;
    const dataTestSubjNegated = filterMeta.negate ? 'filter-negated' : '';
    const dataTestSubjDisabled = `filter-${filterMeta.disabled ? 'disabled' : 'enabled'}`;
    return `filter ${dataTestSubjDisabled} ${dataTestSubjKey} ${dataTestSubjValue} ${dataTestSubjNegated}`;
  }

  function getPanels() {
    const { negate, disabled } = filterMeta;
    return [
      {
        id: 0,
        items: [
          {
            name: i18n.translate('maps.filter.filterBar.editFilterButtonLabel', {
              defaultMessage: 'Edit filter',
            }),
            icon: 'pencil',
            panel: 1,
            'data-test-subj': 'editFilter',
          },
          {
            name: negate
              ? i18n.translate('maps.filter.filterBar.includeFilterButtonLabel', {
                  defaultMessage: 'Include results',
                })
              : i18n.translate('data.filter.filterBar.excludeFilterButtonLabel', {
                  defaultMessage: 'Exclude results',
                }),
            icon: negate ? 'plusInCircle' : 'minusInCircle',
            onClick: () => {
              setIsPopoverOpen(false);
              onToggleNegated();
            },
            'data-test-subj': 'negateFilter',
          },
          {
            name: disabled
              ? i18n.translate('data.filter.filterBar.enableFilterButtonLabel', {
                  defaultMessage: 'Re-enable',
                })
              : i18n.translate('data.filter.filterBar.disableFilterButtonLabel', {
                  defaultMessage: 'Temporarily disable',
                }),
            icon: `${disabled ? 'eye' : 'eyeClosed'}`,
            onClick: () => {
              setIsPopoverOpen(false);
              onToggleDisabled();
            },
            'data-test-subj': 'disableFilter',
          },
          {
            name: i18n.translate('data.filter.filterBar.deleteFilterButtonLabel', {
              defaultMessage: 'Delete',
            }),
            icon: 'trash',
            onClick: () => {
              setIsPopoverOpen(false);
              onRemove();
            },
            'data-test-subj': 'deleteFilter',
          },
        ],
      },
      {
        id: 1,
        width: 600,
        content: (
          <div>
            <FilterEditor
              content={JSON.stringify(filterMeta.params, null, 2)}
              label={filterMeta.alias!}
              onSubmit={onSubmit}
              onCancel={() => {
                setIsPopoverOpen(false);
              }}
            />
          </div>
        ),
      },
    ];
  }

  const badge = (
    <FilterView
      isDisabled={filterMeta.disabled}
      className={getClasses(filterMeta.negate, filterMeta.disabled)}
      onRemove={onRemove}
      valueLabel={filterMeta.alias || ''}
      onClick={handleClick}
      data-test-subj={getDataTestSubj()}
    />
  );

  return (
    <EuiPopover
      id={`popoverFor_filter${id}`}
      className={`globalFilterItem__popover`}
      anchorClassName={`globalFilterItem__popoverAnchor`}
      isOpen={isPopoverOpen}
      closePopover={() => {
        setIsPopoverOpen(false);
      }}
      button={badge}
      anchorPosition="downLeft"
      panelPaddingSize="none"
    >
      <EuiContextMenu initialPanelId={0} panels={getPanels()} size="s" />
    </EuiPopover>
  );
}
