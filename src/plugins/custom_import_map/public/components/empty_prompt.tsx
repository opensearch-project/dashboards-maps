/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment } from 'react';
import { EuiEmptyPrompt } from '@elastic/eui';

export interface EmptyPromptProps {
  iconType: string;
  title: string;
  bodyFragment: string;
  actions: any;
}

const EmptyPrompt = (props: EmptyPromptProps) => {
  return (
    <EuiEmptyPrompt
      iconType={props.iconType}
      title={<h2>{props.title}</h2>}
      body={
        <Fragment>
          <p>{props.bodyFragment}</p>
        </Fragment>
      }
      actions={props.actions}
    />
  );
};

export default EmptyPrompt;
