/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiPanel,
  EuiSpacer,
  EuiForm,
  EuiFlexItem,
  EuiFormRow,
  EuiComboBoxOptionOption,
  EuiTitle,
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
    <EuiPanel paddingSize="s">
      <EuiTitle size="xs">
        <h3>Data Source</h3>
      </EuiTitle>
      <EuiSpacer size="s" />

      <EuiForm style={{ padding: '0 12px' }}>
        <EuiFlexItem>
          <EuiFormRow
            label="Index"
            isInvalid={!indexPattern}
            error={'Required'}
            data-test-subj={'indexPatternSelect'}
            fullWidth={true}
          >
            <IndexPatternSelect
              savedObjectsClient={savedObjectsClient}
              placeholder={i18n.translate('clusterLayer.selectDataSourcePlaceholder', {
                defaultMessage: 'Select data source',
              })}
              indexPatternId={indexPattern?.id || ''}
              onChange={async (newIndexPatternId: EuiComboBoxOptionOption<string>[]) => {
                const newIndexPattern = await indexPatterns.get(newIndexPatternId);
                setIndexPattern(newIndexPattern);
              }}
              isClearable={false}
              data-test-subj={'indexPatternSelect'}
              fullWidth={true}
              isInvalid={!indexPattern}
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiForm>
    </EuiPanel>
  );
};
