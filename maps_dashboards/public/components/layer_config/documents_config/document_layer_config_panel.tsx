/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';
import { LayerBasicSettings } from '../layer_basic_settings';
import { DocumentLayerSource } from './document_layer_source';
import { DocumentLayerStyle } from './document_layer_style';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
}

export const DocumentLayerConfigPanel = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
}: Props) => {
  const tabs = [
    {
      id: 'data-source--id',
      name: 'Data',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <DocumentLayerSource
            selectedLayerConfig={selectedLayerConfig}
            setSelectedLayerConfig={setSelectedLayerConfig}
          />
        </Fragment>
      ),
    },
    {
      id: 'style--id',
      name: 'Style',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <DocumentLayerStyle
            selectedLayerConfig={selectedLayerConfig}
            setSelectedLayerConfig={setSelectedLayerConfig}
          />
        </Fragment>
      ),
    },
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
