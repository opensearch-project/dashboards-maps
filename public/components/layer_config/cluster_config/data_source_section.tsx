/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiFormRow,
} from '@elastic/eui';
import { IndexPattern } from '../../../../../../src/plugins/data/public';
import { useOpenSearchDashboards } from '../../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../../types';
import { i18n } from '@osd/i18n';
import { CanUpdateMapType } from './cluster_layer_source';
import { useEffect } from 'react';

interface Props {
  indexPattern: IndexPattern | null | undefined;
  setIndexPattern: Function;
  setCanUpdateMap: React.Dispatch<React.SetStateAction<CanUpdateMapType>>;
}

const errorsMap = {
  datasource: ['Required'],
  geoFields: ['Required'],
};

export const DataSourceSection = ({ indexPattern, setIndexPattern, setCanUpdateMap }: Props) => {
  const {
    services: {
      savedObjects: { client: savedObjectsClient },
      data: {
        ui: { IndexPatternSelect },
        indexPatterns,
      },
    },
  } = useOpenSearchDashboards<MapServices>();
  
  useEffect(() => {
    setCanUpdateMap((prev) => ({
      ...prev,
      index: !!indexPattern,
    }));
  }, [indexPattern]);

  return (
    <EuiFormRow
      label="Index pattern"
      isInvalid={!indexPattern}
      error={errorsMap.datasource}
      fullWidth
    >
      <IndexPatternSelect
        savedObjectsClient={savedObjectsClient}
        placeholder={i18n.translate('clusterLayer.selectDataSourcePlaceholder', {
          defaultMessage: 'Select data source',
        })}
        indexPatternId={indexPattern?.id || ''}
        onChange={async (newIndexPatternId: any) => {
          const newIndexPattern = await indexPatterns.get(newIndexPatternId);
          setIndexPattern(newIndexPattern);
        }}
        isClearable={false}
        data-test-subj={'indexPatternSelect'}
        fullWidth={true}
        isInvalid={!indexPattern}
      />
    </EuiFormRow>
  );
};
