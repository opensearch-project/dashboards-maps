/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';

import { FilterItem } from './filter_item';
import { GeoShapeFilterMeta } from '../../../../../src/plugins/data/common';
import {
  disableGeoShapeFilterMeta,
  enableGeoShapeFilterMeta,
  toggleGeoShapeFilterMetaDisabled,
  toggleGeoShapeFilterMetaNegated,
} from './filter_actions';
import { FilterOptions } from './filter_options';

interface Props {
  filters: GeoShapeFilterMeta[];
  onFiltersUpdated?: (filters: GeoShapeFilterMeta[]) => void;
  className: string;
}
export const FilterBar = ({ filters, onFiltersUpdated, className }: Props) => {
  function updateFilters(items: GeoShapeFilterMeta[]) {
    if (onFiltersUpdated) {
      onFiltersUpdated(items);
    }
  }

  function renderItems(filterMeta: GeoShapeFilterMeta[]) {
    return filterMeta.map((meta, i) => (
      <EuiFlexItem key={i} grow={false} className="globalFilterBar__flexItem">
        <FilterItem
          id={`${i}`}
          filterMeta={meta}
          onUpdate={(newFilter) => onUpdate(i, newFilter)}
          onRemove={() => onRemove(i)}
        />
      </EuiFlexItem>
    ));
  }

  function onEnableAll() {
    const updatedFilters: GeoShapeFilterMeta[] = filters.map(enableGeoShapeFilterMeta);
    if (onFiltersUpdated) {
      onFiltersUpdated(updatedFilters);
    }
  }

  function onDisableAll() {
    const updatedFilters: GeoShapeFilterMeta[] = filters.map(disableGeoShapeFilterMeta);
    if (onFiltersUpdated) {
      onFiltersUpdated(updatedFilters);
    }
  }

  function onToggleAllNegated() {
    const updatedFilters: GeoShapeFilterMeta[] = filters.map(toggleGeoShapeFilterMetaNegated);
    if (onFiltersUpdated) {
      onFiltersUpdated(updatedFilters);
    }
  }

  function onToggleAllDisabled() {
    const updatedFilters: GeoShapeFilterMeta[] = filters.map(toggleGeoShapeFilterMetaDisabled);
    if (onFiltersUpdated) {
      onFiltersUpdated(updatedFilters);
    }
  }

  function onRemoveAll() {
    if (onFiltersUpdated) {
      onFiltersUpdated([]);
    }
  }

  function onRemove(i: number) {
    const updatedFilters = [...filters];
    updatedFilters.splice(i, 1);
    updateFilters(updatedFilters);
  }

  function onUpdate(i: number, filter: GeoShapeFilterMeta) {
    const current = [...filters];
    current[i] = filter;
    updateFilters(current);
  }

  const classes = classNames('globalFilterBar', className);

  return (
    <EuiFlexGroup
      className="globalFilterGroup"
      gutterSize="none"
      alignItems="flexStart"
      responsive={false}
    >
      <EuiFlexItem className="globalFilterGroup__branch" grow={false}>
        <FilterOptions
          onEnableAll={onEnableAll}
          onDisableAll={onDisableAll}
          onToggleAllNegated={onToggleAllNegated}
          onToggleAllDisabled={onToggleAllDisabled}
          onRemoveAll={onRemoveAll}
        />
      </EuiFlexItem>
      <EuiFlexItem className="globalFilterGroup__filterFlexItem">
        <EuiFlexGroup
          className={classes}
          wrap={true}
          responsive={false}
          gutterSize="xs"
          alignItems="center"
        >
          {renderItems(filters)}
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
