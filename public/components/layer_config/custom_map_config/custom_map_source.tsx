/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { EuiSpacer, EuiPanel, EuiForm, EuiCompressedFieldText, EuiSelect, EuiCompressedFormRow } from '@elastic/eui';
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
  const customMapTypeOptions = [
    { value: 'tms', text: 'Tile Map Service (TMS)' },
    { value: 'wms', text: 'Web Map Service (WMS)' },
  ];

  const [customMapURL, setCustomMapURL] = useState<string>('');
  const [customMapAttribution, setCustomMapAttribution] = useState<string>('');
  const [customType, setCustomType] = useState(customMapTypeOptions[1].value);
  const [WMSLayers, setWMSLayers] = useState<string>('');
  const [WMSVersion, setWMSVersion] = useState<string>('');
  const [WMSFormat, setWMSFormat] = useState<string>('');
  const [WMSStyles, setWMSStyles] = useState<string>('');
  // CRS: Coordinate reference systems in WMS
  const [WMSCoordinateSystem, setWMSCoordinateSystem] = useState<string>('');
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

  const onChangeCustomType = (e: any) => {
    setCustomType(e.target.value);
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      source: {
        ...selectedLayerConfig?.source,
        customType: e.target.value,
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

  const onChangeWMSCoordinateSystem = (e: any) => {
    setWMSCoordinateSystem(e.target.value);
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
    setCustomType(selectedLayerConfig.source.customType);
    setCustomMapAttribution(selectedLayerConfig.source.attribution);
    if (selectedLayerConfig.source.customType === 'wms') {
      setWMSLayers(selectedLayerConfig.source.layers);
      setWMSVersion(selectedLayerConfig.source.version);
      setWMSFormat(selectedLayerConfig.source.format);
      setWMSStyles(selectedLayerConfig.source.styles);
      setWMSCoordinateSystem(selectedLayerConfig.source.crs);
      setWMSBbox(selectedLayerConfig.source.bbox);
    }
  }, [selectedLayerConfig]);

  useEffect(() => {
    setCustomMapAttribution(selectedLayerConfig.source.attribution);
  }, [selectedLayerConfig.source.attribution]);

  useEffect(() => {
    if (customType === 'wms') {
      setIsUpdateDisabled(
        customMapURL === '' ||
          WMSLayers === '' ||
          WMSVersion === '' ||
          WMSFormat === '' ||
          isInvalidURL(customMapURL)
      );
    } else {
      setIsUpdateDisabled(customMapURL === '' || isInvalidURL(customMapURL));
    }
  }, [WMSFormat, WMSLayers, WMSVersion, customMapURL, customType, setIsUpdateDisabled]);

  return (
    <div>
      <EuiPanel paddingSize="s">
        <EuiForm>
          <EuiCompressedFormRow label="Custom type" helpText="Choose custom map type." fullWidth={true}>
            <EuiSelect
              options={customMapTypeOptions}
              value={customType}
              onChange={onChangeCustomType}
              fullWidth={true}
            />
          </EuiCompressedFormRow>
        </EuiForm>
        <EuiSpacer size="m" />
        {selectedLayerConfig.source.customType === 'tms' && (
          <EuiForm>
            <EuiCompressedFormRow
              label="TMS URL*"
              helpText="Raster tile map service URL."
              isInvalid={isInvalidURL(customMapURL)}
              error={isInvalidURL(customMapURL) ? 'Invalid URL' : undefined}
              fullWidth={true}
            >
              <EuiCompressedFieldText
                placeholder="https://www.example.com/tiles/{z}/{x}/{y}.png"
                value={customMapURL}
                onChange={onChangeCustomMapURL}
                isInvalid={isInvalidURL(customMapURL)}
                fullWidth={true}
              />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="TMS attribution"
              helpText="The attribution for the TMS layer, displayed in the lower-right corner of the map."
              fullWidth={true}
            >
              <EuiCompressedFieldText
                value={customMapAttribution}
                onChange={onChangeCustomMapAttribution}
                fullWidth={true}
              />
            </EuiCompressedFormRow>
          </EuiForm>
        )}
        {selectedLayerConfig.source.customType === 'wms' && (
          <EuiForm>
            <EuiCompressedFormRow
              label="WMS URL*"
              helpText="Web map service URL"
              isInvalid={isInvalidURL(customMapURL)}
              error={isInvalidURL(customMapURL) ? 'Invalid URL' : undefined}
              fullWidth={true}
            >
              <EuiCompressedFieldText
                placeholder="https://www.example.com/wms/dataset"
                value={customMapURL}
                onChange={onChangeCustomMapURL}
                isInvalid={isInvalidURL(customMapURL)}
                fullWidth={true}
              />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="WMS layers*"
              helpText="The names of the layers to include in the map image. For more than one name, use a comma-separated list."
              fullWidth={true}
            >
              <EuiCompressedFieldText value={WMSLayers} onChange={onChangeWMSLayers} fullWidth={true} />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow label="WMS version*" fullWidth={true}>
              <EuiCompressedFieldText value={WMSVersion} onChange={onChangeWMSVersion} fullWidth={true} />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="WMS format*"
              helpText="The format of the map image to return. The most common formats are 'image/png' and 'image/jpeg'."
              fullWidth={true}
            >
              <EuiCompressedFieldText value={WMSFormat} onChange={onChangeWMSFormat} fullWidth={true} />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="WMS CRS"
              helpText="The coordinate reference system (CRS) to use for the map image."
              fullWidth={true}
            >
              <EuiCompressedFieldText
                value={WMSCoordinateSystem}
                onChange={onChangeWMSCoordinateSystem}
                fullWidth={true}
              />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="WMS bbox"
              helpText="The bounding box of the region to include in the map image."
              fullWidth={true}
            >
              <EuiCompressedFieldText value={WMSBbox} onChange={onChangeWMSBbox} fullWidth={true} />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="WMS attribution"
              helpText="The attribution for this WMS layer, displayed at right-bottom map."
              fullWidth={true}
            >
              <EuiCompressedFieldText
                value={customMapAttribution}
                onChange={onChangeCustomMapAttribution}
                fullWidth={true}
              />
            </EuiCompressedFormRow>
            <EuiSpacer size="m" />
            <EuiCompressedFormRow
              label="WMS styles"
              helpText="The styles to be used for each of the layers in the map image."
              fullWidth={true}
            >
              <EuiCompressedFieldText value={WMSStyles} onChange={onChangeWMSStyles} fullWidth={true} />
            </EuiCompressedFormRow>
          </EuiForm>
        )}
        <EuiSpacer size="s" />
      </EuiPanel>
    </div>
  );
};
