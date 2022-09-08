/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import './layer_control_panel.scss';

const LayerControlPanel = () => {
  return (
    <I18nProvider>
      <EuiPanel paddingSize="s" className="leaflet-control maplibre-control-layer">
        <EuiTitle size="xs" className="maplibre-control-layer-title">
          <h2>
            <FormattedMessage
              id="mapsDashboards.maplibre.layerControlTitle"
              defaultMessage="Map Layers"
            />
          </h2>
        </EuiTitle>
        <EuiSpacer size="s" />
        <div> Roadmap </div>
        <EuiSpacer size="s" />
      </EuiPanel>
    </I18nProvider>
  );
};

export { LayerControlPanel };
