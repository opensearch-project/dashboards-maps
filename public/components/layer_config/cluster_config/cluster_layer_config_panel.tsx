/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment, useState } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { ClusterLayerSpecification } from '../../../model/mapLayerType';
import { LayerBasicSettings } from '../layer_basic_settings';
import { ClusterLayerSource } from './cluster_layer_source';
import { ClusterLayerStyle } from './style';
import { IndexPattern } from '../../../../../../src/plugins/data/common';
import { useCallback } from 'react';

interface Props {
  selectedLayerConfig: ClusterLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  isLayerExists: Function;
}

export const ClusterLayerConfigPanel = (props: Props) => {
  const [indexPattern, setIndexPattern] = useState<IndexPattern | null | undefined>();
  const [dataUpdateDisabled, setDataUpdateDisabled] = useState(true);

  const setIsUpdateDisabled = useCallback(
    (isUpdateDisabled: boolean, isFromDataPanel = false) => {
      //we can't judge whether source is valid only by selectLayerConfig like documents. We need a state to record it.
      if (isFromDataPanel) {
        setDataUpdateDisabled(isUpdateDisabled);
        props.setIsUpdateDisabled(isUpdateDisabled);
      } else {
        props.setIsUpdateDisabled(dataUpdateDisabled || isUpdateDisabled);
      }
    },
    [dataUpdateDisabled]
  );

  const newProps = {
    ...props,
    setIsUpdateDisabled,
    indexPattern,
    setIndexPattern,
  };

  const tabs = [
    {
      id: 'data-source--id',
      name: 'Data',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <ClusterLayerSource {...newProps} />
        </Fragment>
      ),
      testsubj: 'dataTab',
    },
    {
      id: 'style--id',
      name: 'Style',
      content: (
        <Fragment>
          <EuiSpacer size="m" />
          <ClusterLayerStyle {...newProps} />
        </Fragment>
      ),
      testsubj: 'styleTab',
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
      testsubj: 'settingsTab',
    },
  ];
  return <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />;
};
