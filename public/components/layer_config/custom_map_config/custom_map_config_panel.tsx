/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { CustomLayerSpecification } from '../../../model/mapLayerType';
import { LayerBasicSettings } from '../layer_basic_settings';
import { CustomMapSource } from './custom_map_source';

interface Props {
  selectedLayerConfig: CustomLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  isLayerExists: Function;
}

export const CustomMapConfigPanel = (props: Props) => {
  const newProps = {
    ...props,
  };

  const tabs = [
    {
      id: 'custom-map-source--id',
      name: 'Data',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <CustomMapSource {...newProps} />
        </Fragment>
      ),
    },
    {
      id: 'settings--id',
      name: 'Settings',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <LayerBasicSettings {...newProps} />
        </Fragment>
      ),
    },
  ];
  return <EuiTabbedContent tabs={tabs} size="s" initialSelectedTab={tabs[0]} />;
};
