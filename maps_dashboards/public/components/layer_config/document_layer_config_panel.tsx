import React, { Fragment } from 'react';
import { EuiSpacer, EuiText, EuiTabbedContent } from '@elastic/eui';
import { ILayerConfig } from '../../model/ILayerConfig';
import { LayerBasicSettings } from './layer_basic_settings';
import { DocumentLayerSource } from './document_layer_source';
import { DocumentLayerStyle } from './document_layer_style';

interface Props {
  selectedLayerConfig: ILayerConfig;
  setSelectedLayerConfig: Function;
}

export const DocumentLayerConfigPanel = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
}: Props) => {
  const tabs = [
    {
      id: 'data-source--id',
      name: 'Data source',
      content: (
        <Fragment>
          <EuiSpacer />
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
          <EuiSpacer />
          <EuiText>
            <DocumentLayerStyle
              selectedLayerConfig={selectedLayerConfig}
              setSelectedLayerConfig={setSelectedLayerConfig}
            />
          </EuiText>
        </Fragment>
      ),
    },
    {
      id: 'settings--id',
      name: 'Settings',
      content: (
        <LayerBasicSettings
          selectedLayerConfig={selectedLayerConfig}
          setSelectedLayerConfig={setSelectedLayerConfig}
        />
      ),
    },
  ];
  return <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />;
};
