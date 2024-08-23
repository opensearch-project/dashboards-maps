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
  setIsUpdateDisabled: Function;
  isLayerExists: Function;
}

export const BaseMapLayerConfigPanel = (props: Props) => {
  const tabs = [
    {
      id: 'settings--id',
      name: 'Settings',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <LayerBasicSettings {...props} />
        </Fragment>
      ),
    },
  ];
  return <EuiTabbedContent tabs={tabs} size="s" initialSelectedTab={tabs[0]} />;
};
