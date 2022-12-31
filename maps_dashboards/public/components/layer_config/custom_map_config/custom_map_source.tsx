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
  EuiSelect,
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
  const customMapProtocolOptions = [
    { value: 'tms', text: 'Tile Map Service (TMS)' },
    { value: 'wms', text: 'Web Map Service (WMS)' },
  ];

  const [customMapURL, setCustomMapURL] = useState<string>('');
  const [customMapAttribution, setCustomMapAttribution] = useState<string>('');
  const [protocol, setProtocol] = useState(customMapProtocolOptions[1].value);
  const [WMSLayers, setWMSLayers] = useState<string>('');
  const [WMSVersion, setWMSVersion] = useState<string>('');
  const [WMSFormat, setWMSFormat] = useState<string>('');
  const [WMSStyles, setWMSStyles] = useState<string>('');
  // CRS: Coordinate reference systems in WMS
  const [WMSCRS, setWMSCRS] = useState<string>('');
  const [WMSBbox, setWMSBbox] = useState<string>('');

  const onChangeCustomMapURL = (e: any) => {
    setCustomMapURL(e.target.value);
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
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        attribution: e.target.value,
      },
    });
  };

  const onChangeProtocol = (e: any) => {
    setProtocol(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        protocol: e.target.value,
      },
    });
  };

  const onChangeWMSLayers = (e: any) => {
    setWMSLayers(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        layers: e.target.value,
      },
    });
  };

  const onChangeWMSVersion = (e: any) => {
    setWMSVersion(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        version: e.target.value,
      },
    });
  };

  const onChangeWMSFormat = (e: any) => {
    setWMSFormat(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        format: e.target.value,
      },
    });
  };

  const onChangeWMSStyles = (e: any) => {
    setWMSStyles(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        styles: e.target.value,
      },
    });
  };

  const onChangeWMSCRS = (e: any) => {
    setWMSCRS(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        crs: e.target.value,
      },
    });
  };

  const onChangeWMSBbox = (e: any) => {
    setWMSBbox(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        bbox: e.target.value,
      },
    });
  };

  const isInvalidURL = (url: string): boolean => {
    if (url === '') return false;
    try {
      new URL(url);
      return false;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    setCustomMapURL(selectedLayerConfig.source.url);
    setProtocol(selectedLayerConfig.source.protocol);
    setCustomMapAttribution(selectedLayerConfig.source.attribution);
    if (selectedLayerConfig.source.protocol === 'wms') {
      setWMSLayers(selectedLayerConfig.source.layers);
      setWMSVersion(selectedLayerConfig.source.version);
      setWMSFormat(selectedLayerConfig.source.format);
      setWMSStyles(selectedLayerConfig.source.styles);
      setWMSCRS(selectedLayerConfig.source.crs);
      setWMSBbox(selectedLayerConfig.source.bbox);
    }
  }, [selectedLayerConfig]);

  useEffect(() => {
    setCustomMapAttribution(selectedLayerConfig.source.attribution);
  }, [selectedLayerConfig.source.attribution]);

  useEffect(() => {
    if (protocol === 'wms') {
      setIsUpdateDisabled(isInvalidURL(customMapURL) || WMSLayers === '' || WMSVersion === '');
    } else {
      setIsUpdateDisabled(isInvalidURL(customMapURL));
    }
  }, [
    WMSBbox,
    WMSCRS,
    WMSFormat,
    WMSLayers,
    WMSStyles,
    WMSVersion,
    customMapURL,
    protocol,
    setIsUpdateDisabled,
  ]);

  return (
    <div>
      <EuiPanel paddingSize="s">
        <EuiForm>
          <EuiFlexGrid columns={1}>
            <EuiFlexItem>
              <EuiFormLabel>Protocol</EuiFormLabel>
              <EuiSpacer size="xs" />
              <EuiSelect
                options={customMapProtocolOptions}
                value={protocol}
                onChange={onChangeProtocol}
                fullWidth
              />
            </EuiFlexItem>
            {selectedLayerConfig.source.protocol === 'tms' && (
              <>
                <EuiFlexItem>
                  <EuiFormLabel>TMS URL</EuiFormLabel>
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
                  <EuiFormLabel>TMS attribution</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText
                    value={customMapAttribution}
                    onChange={onChangeCustomMapAttribution}
                    fullWidth={true}
                  />
                </EuiFlexItem>
              </>
            )}
            {selectedLayerConfig.source.protocol === 'wms' && (
              <>
                <EuiFlexItem>
                  <EuiFormLabel>WMS URL</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText
                    placeholder="https://www.example.com/wms/dataset"
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
                  <EuiFormLabel>WMS layers</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText value={WMSLayers} onChange={onChangeWMSLayers} fullWidth={true} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormLabel>WMS version</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText value={WMSVersion} onChange={onChangeWMSVersion} fullWidth={true} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormLabel>WMS format</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText value={WMSFormat} onChange={onChangeWMSFormat} fullWidth={true} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormLabel>WMS CRS</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText value={WMSCRS} onChange={onChangeWMSCRS} fullWidth={true} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormLabel>WMS bbox</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText value={WMSBbox} onChange={onChangeWMSBbox} fullWidth={true} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormLabel>WMS attribution</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText
                    value={customMapAttribution}
                    onChange={onChangeCustomMapAttribution}
                    fullWidth={true}
                  />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormLabel>WMS styles</EuiFormLabel>
                  <EuiSpacer size="xs" />
                  <EuiFieldText value={WMSStyles} onChange={onChangeWMSStyles} fullWidth={true} />
                </EuiFlexItem>
              </>
            )}
          </EuiFlexGrid>
        </EuiForm>
        <EuiSpacer size="xs" />
      </EuiPanel>
    </div>
  );
};
