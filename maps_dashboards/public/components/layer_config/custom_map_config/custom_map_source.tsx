/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  EuiFlexItem,
  EuiFormLabel,
  EuiFlexGrid,
  EuiSpacer,
  EuiPanel,
  EuiForm,
  EuiFieldText,
  EuiFormErrorText,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { CustomLayerSpecification } from '../../../model/mapLayerType';

interface Props {
  selectedLayerConfig: CustomLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
}

export const CustomMapSource = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
  setIsUpdateDisabled,
}: Props) => {
  const [customMapURL, setCustomMapURL] = useState<string>('');
  const [customMapAttribution, setCustomMapAttribution] = useState<string>('');

  const onChangeCustomMapURL = (e: any) => {
    setCustomMapURL(e.target.value);
    setIsUpdateDisabled(false);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        url: e.target.value,
      },
    });
  };

  const onChangeCustomMapAttribution = (e: any) => {
    setCustomMapAttribution(e.target.value);
    setIsUpdateDisabled(false);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        attribution: e.target.value,
      },
    });
  };

  const isInvalidURL = (url: string): boolean => {
    try {
      new URL(url);
      return false;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    setCustomMapURL(selectedLayerConfig.source.url);
  }, [selectedLayerConfig.source.url]);

  useEffect(() => {
    setCustomMapAttribution(selectedLayerConfig.source.attribution);
  }, [selectedLayerConfig.source.attribution]);

  useEffect(() => {
    const disableUpdate = isInvalidURL(customMapURL);
    setIsUpdateDisabled(disableUpdate);
  }, [customMapURL, setIsUpdateDisabled]);

  return (
    <div>
      <EuiPanel paddingSize="s">
        <EuiForm>
          <EuiFlexGrid columns={1}>
            <EuiFlexItem>
              <EuiFormLabel>Raster Tile URL</EuiFormLabel>
              <EuiSpacer size="xs" />
              <EuiFieldText
                placeholder="https://www.example.com/tiles/{z}/{x}/{y}.png"
                value={customMapURL}
                onChange={onChangeCustomMapURL}
                isInvalid={isInvalidURL(customMapURL)}
                fullWidth={true}
              />
              {isInvalidURL(customMapURL) && (
                <EuiFormErrorText>
                  <FormattedMessage
                    id="maps.customMap.dataSource.errorMessage"
                    defaultMessage="Must be a valid URL"
                  />
                </EuiFormErrorText>
              )}
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormLabel>Raster Tile Attribution</EuiFormLabel>
              <EuiSpacer size="xs" />
              <EuiFieldText
                value={customMapAttribution}
                onChange={onChangeCustomMapAttribution}
                fullWidth={true}
              />
            </EuiFlexItem>
          </EuiFlexGrid>
        </EuiForm>
        <EuiSpacer size="xs" />
      </EuiPanel>
    </div>
  );
};
