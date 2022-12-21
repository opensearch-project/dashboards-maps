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

  const newProps = {
    ...props,
    setIsUpdateDisabled,
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
  return <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />;
};
