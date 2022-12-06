/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { LayerBasicSettings } from './layer_basic_settings';

interface Props {
  selectedLayerConfig: MapLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const BaseMapLayerConfigPanel = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
}: Props) => {
  const tabs = [
    {
      id: 'settings--id',
      name: 'Settings',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <LayerBasicSettings
            selectedLayerConfig={selectedLayerConfig}
            setSelectedLayerConfig={setSelectedLayerConfig}
          />
        </Fragment>
      ),
    },
  ];
  return <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />;
};
