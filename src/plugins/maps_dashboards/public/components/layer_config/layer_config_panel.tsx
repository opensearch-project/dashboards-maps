/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiButton,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiCodeBlock,
  EuiTitle,
} from '@elastic/eui';
import { ILayerConfig } from '../../model/ILayerConfig';

interface Props {
  setIsLayerConfigVisible: Function;
  selectedLayerConfig: ILayerConfig;
}

export const LayerConfigPanel = ({ setIsLayerConfigVisible, selectedLayerConfig }: Props) => {
  return (
    <EuiFlyout type="push" size="s" onClose={() => setIsLayerConfigVisible(false)}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>{selectedLayerConfig.name}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiCodeBlock
          language="js"
          fontSize="m"
          paddingSize="m"
          color="dark"
          overflowHeight={300}
          isCopyable
        >
          {JSON.stringify(selectedLayerConfig)}
        </EuiCodeBlock>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiButton onClick={() => setIsLayerConfigVisible(false)}>Close</EuiButton>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
};
