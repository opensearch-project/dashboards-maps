/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiLink } from '@elastic/eui';
import React from 'react';
import { ToastInputFields } from '../../../../../src/core/public';
import { toMountPoint } from '../../../../../src/plugins/opensearch_dashboards_react/public';

export const RegionConflictWarningMsg: ToastInputFields = {
  title: 'The default Dashboards Maps Service is currently not available in your region',
  text: toMountPoint(
    <p>
      <EuiLink
        href="https://opensearch.org/docs/latest/dashboards/visualize/maps/#adding-a-custom-map"
        target="_blank"
      >
        You can configure OpenSearch Dashboards to use a custom map server for dashboards maps.
      </EuiLink>
    </p>
  ),
};
