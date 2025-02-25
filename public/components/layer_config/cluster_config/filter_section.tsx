/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import { EuiSpacer, EuiCompressedFormRow, EuiCompressedCheckbox } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../../types';
import { ClusterLayerSpecification } from 'public/model/mapLayerType';
import { Filter, IndexPattern } from '../../../../../../src/plugins/data/public';
import { useEffect } from 'react';

interface Props {
  indexPattern: IndexPattern | null | undefined;
  selectedLayerConfig: ClusterLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const FilterSection = ({
  indexPattern,
  selectedLayerConfig,
  setSelectedLayerConfig,
}: Props) => {
  const {
    services: {
      data: {
        ui: { SearchBar },
      },
    },
  } = useOpenSearchDashboards<MapServices>();

  const onFiltersUpdated = useCallback(
    (filters: Filter[]) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        source: { ...selectedLayerConfig.source, filters },
      });
    },
    [selectedLayerConfig, indexPattern]
  );

  const onToggleGeoBoundingBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = { ...selectedLayerConfig.source, useGeoBoundingBoxFilter: e.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  const onApplyGlobalFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = { ...selectedLayerConfig.source, applyGlobalFilters: e.target.checked };
    setSelectedLayerConfig({ ...selectedLayerConfig, source });
  };

  useEffect(() => {
    //if index is changed, reset filters
    onFiltersUpdated([]);
  }, [indexPattern]);

  return (
    <>
      <SearchBar
        appName="maps-dashboards"
        showQueryBar={false}
        indexPatterns={indexPattern ? [indexPattern] : []}
        filters={selectedLayerConfig.source.filters ?? []}
        onFiltersUpdated={onFiltersUpdated}
      />
      <EuiSpacer size="s" />
      <EuiCompressedFormRow>
        <EuiCompressedCheckbox
          id={`${selectedLayerConfig.id}-bounding-box-filter`}
          label={'Only request data around map extent'}
          checked={selectedLayerConfig.source.useGeoBoundingBoxFilter ? true : false}
          onChange={onToggleGeoBoundingBox}
        />
      </EuiCompressedFormRow>
      <EuiCompressedFormRow>
        <EuiCompressedCheckbox
          id={`${selectedLayerConfig.id}-apply-global-filter`}
          label={i18n.translate('clusterLayer.applyGlobalFilters', {
            defaultMessage: 'Apply global filters',
          })}
          checked={selectedLayerConfig.source?.applyGlobalFilters ?? true}
          onChange={onApplyGlobalFilters}
        />
      </EuiCompressedFormRow>
    </>
  );
};
