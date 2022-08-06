/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { useEffect, useMemo } from 'react';
import { EuiLink, EuiSpacer, EuiText, EuiScreenReaderOnly } from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';

import { TextInputOption } from '../../../../../../src/plugins/charts/public';

/**
 * WMS layer options
 */
export interface WMSConfigurationOptions {
  url?: string;
  version?: string;
  layers?: string;
  format?: string;
  transparent?: boolean;
  attribution?: string;
  styles?: string;
}
interface WmsConfigurationOptionsProps {
  wms: WMSConfigurationOptions;
  setTypeOptions<T extends keyof WMSConfigurationOptions>(paramName: T, value: WMSConfigurationOptions[T]): void;
  setOptionValidity(isValid: boolean): void
}

function WmsConfigurationOptions({ wms, setTypeOptions, setOptionValidity }: WmsConfigurationOptionsProps) {

  const wmsLink = (
    <EuiLink href="http://www.opengeospatial.org/standards/wms" target="_blank">
      <FormattedMessage id="maps_legacy.wmsOptions.wmsLinkText" defaultMessage="OGC standard" />
    </EuiLink>
  );
  const footnoteText = (
    <>
      <span aria-hidden="true">*</span>
      <FormattedMessage
        id="maps_legacy.wmsOptions.mapLoadFailDescription"
        defaultMessage="If this parameter is incorrect, maps will fail to load."
      />
    </>
  );

  // initalize the configuration
  useMemo(() => {
    setTypeOptions('format', 'image/png');
  }, []);

   // Validate user input
   useEffect(() => {
    if (wms.url && wms.format) {
      setOptionValidity(true);
    } else {
      setOptionValidity(false);
    }
  }, [wms]);

  return (
    <>
      <EuiSpacer size="xs" />
      <EuiText size="xs">
        <FormattedMessage
          id="maps_legacy.wmsOptions.wmsDescription"
          defaultMessage="WMS is an {wmsLink} for map image services."
          values={{ wmsLink }}
        />
      </EuiText>
      <EuiSpacer size="m" />

      <TextInputOption
        label={
          <>
            <FormattedMessage id="maps_legacy.wmsOptions.wmsUrlLabel" defaultMessage="WMS url" />
            <span aria-hidden="true">*</span>
          </>
        }
        helpText={
          <FormattedMessage
            id="maps_legacy.wmsOptions.urlOfWMSWebServiceTip"
            defaultMessage="The URL of the WMS web service."
          />
        }
        paramName="url"
        value={wms.url}
        setValue={setTypeOptions}
      />

      <TextInputOption
        label={
          <FormattedMessage
            id="maps_legacy.wmsOptions.wmsLayersLabel"
            defaultMessage="WMS sub-layers"
          />
        }
        helpText={
          <FormattedMessage
            id="maps_legacy.wmsOptions.listOfLayersToUseTip"
            defaultMessage="A comma separated list of layers to use."
          />
        }
        paramName="layers"
        value={wms.layers}
        setValue={setTypeOptions}
      />

      <TextInputOption
        label={
          <>
            <FormattedMessage
              id="maps_legacy.wmsOptions.wmsVersionLabel"
              defaultMessage="WMS version"
            />
            <span aria-hidden="true">*</span>
          </>
        }
        helpText={
          <FormattedMessage
            id="maps_legacy.wmsOptions.versionOfWMSserverSupportsTip"
            defaultMessage="The version of WMS the server supports."
          />
        }
        paramName="version"
        value={wms.version}
        setValue={setTypeOptions}
      />

      <TextInputOption
        label={
          <>
            <FormattedMessage
              id="maps_legacy.wmsOptions.wmsFormatLabel"
              defaultMessage="WMS format"
            />
            <span aria-hidden="true">*</span>
          </>
        }
        helpText={
          <FormattedMessage
            id="maps_legacy.wmsOptions.imageFormatToUseTip"
            defaultMessage="Usually image/png or image/jpeg. Use png if the server will return transparent layers."
          />
        }
        paramName="format"
        value={wms.format}
        setValue={setTypeOptions}
      />

      <TextInputOption
        label={
          <FormattedMessage
            id="maps_legacy.wmsOptions.wmsAttributionLabel"
            defaultMessage="WMS attribution"
          />
        }
        helpText={
          <FormattedMessage
            id="maps_legacy.wmsOptions.attributionStringTip"
            defaultMessage="Attribution string for the lower right corner."
          />
        }
        paramName="attribution"
        value={wms.attribution}
        setValue={setTypeOptions}
      />

      <TextInputOption
        label={
          <>
            <FormattedMessage
              id="maps_legacy.wmsOptions.wmsStylesLabel"
              defaultMessage="WMS styles"
            />
            <span aria-hidden="true">*</span>
          </>
        }
        helpText={
          <FormattedMessage
            id="maps_legacy.wmsOptions.wmsServerSupportedStylesListTip"
            defaultMessage="A comma separated list of WMS server supported styles to use. Blank in most cases."
          />
        }
        paramName="styles"
        value={wms.styles}
        setValue={setTypeOptions}
      />

      <EuiText size="xs">
        <p aria-hidden="true">{footnoteText}</p>
      </EuiText>
    </>
  );
}

export { WmsConfigurationOptions };
