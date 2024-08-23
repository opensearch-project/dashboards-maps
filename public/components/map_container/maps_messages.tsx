/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiLink, EuiText } from '@elastic/eui';
import React from 'react';
import { ToastInputFields } from '../../../../../src/core/public';
import { toMountPoint } from '../../../../../src/plugins/opensearch_dashboards_react/public';

export const MapsServiceErrorMsg: ToastInputFields = {
  title: 'The OpenSearch Maps Service is currently not available in your region',
  text: toMountPoint( 
    <p>
      You can configure OpenSearch Dashboards to use a{' '}
      <EuiLink
        href="https://opensearch.org/docs/latest/dashboards/visualize/maps/#adding-a-custom-map"
        target="_blank"
      >
        custom map
      </EuiLink>{' '}
      server for dashboards maps.
    </p>
  ),
};
