/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment, useState } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { DocumentLayerSpecification } from '../../../model/mapLayerType';
import { LayerBasicSettings } from '../layer_basic_settings';
import { DocumentLayerSource } from './document_layer_source';
import { DocumentLayerStyle } from './style/document_layer_style';
import { IndexPattern } from '../../../../../../src/plugins/data/common';

interface Props {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  isLayerExists: Function;
}

export const DocumentLayerConfigPanel = (props: Props) => {
  const { selectedLayerConfig } = props;

  const checkKeys = [
    'name',
    {
      key: 'source',
      children: ['indexPatternId', 'geoFieldName'],
    },
  ];
  const setIsUpdateDisabled = (isUpdateDisabled: boolean) => {
    const check = (obj: any, keys: any) => {
      return keys.some((key: any) => {
        if (typeof key === 'string') {
          return !obj[key];
        } else {
          return !obj[key.key] || check(obj[key.key], key.children);
        }
      });
    };
    props.setIsUpdateDisabled(check(selectedLayerConfig, checkKeys) || isUpdateDisabled);
  };

  const [indexPattern, setIndexPattern] = useState<IndexPattern | null | undefined>();

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
          <DocumentLayerSource {...newProps} />
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
          <DocumentLayerStyle {...newProps} />
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
