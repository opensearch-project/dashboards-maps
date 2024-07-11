/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiSmallButton,
  EuiSmallButtonEmpty,
  EuiCodeEditor,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiPopoverTitle,
  EuiSpacer,
} from '@elastic/eui';
import React, { useState } from 'react';
import { i18n } from '@osd/i18n';

interface Props {
  content: string;
  label: string;
  onSubmit: (content: string, label: string) => void;
  onCancel: () => void;
}

const isFilterValid = (content: string) => {
  try {
    return Boolean(JSON.parse(content));
  } catch (e) {
    return false;
  }
};

export const FilterEditor = ({ content, label, onSubmit, onCancel }: Props) => {
  const [filterLabel, setFilterLabel] = useState<string>(label);
  const [filterContent, setFilterContent] = useState<string>(content);

  const renderEditor = () => {
    return (
      <EuiFormRow
        label={i18n.translate('maps.filter.filterEditor.parameters', {
          defaultMessage: 'Spatial filter parameters',
        })}
        fullWidth={true}
      >
        <EuiCodeEditor
          value={filterContent}
          onChange={setFilterContent}
          mode="json"
          width="100%"
          height="250px"
        />
      </EuiFormRow>
    );
  };
  return (
    <div>
      <EuiPopoverTitle>
        <EuiFlexGroup alignItems="baseline" responsive={false}>
          <EuiFlexItem>{'Edit Filter'}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiPopoverTitle>

      <div className="globalFilterItem__editorForm">
        <EuiForm>
          {renderEditor()}
          <div>
            <EuiSpacer size="m" />
            <EuiFormRow
              fullWidth={true}
              label={i18n.translate('maps.filter.filterEditor.createCustomLabelInputLabel', {
                defaultMessage: 'Custom label',
              })}
            >
              <EuiFieldText
                fullWidth={true}
                value={filterLabel}
                onChange={(event) => setFilterLabel(event.target.value)}
              />
            </EuiFormRow>
          </div>
          <EuiSpacer size="m" />
          <EuiFlexGroup direction="rowReverse" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiSmallButton
                fill
                onClick={() => onSubmit(filterContent, filterLabel)}
                isDisabled={!isFilterValid(filterContent)}
                data-test-subj="saveFilter"
              >
                {'Save'}
              </EuiSmallButton>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiSmallButtonEmpty flush="right" onClick={onCancel} data-test-subj="cancelSaveFilter">
                {'Cancel'}
              </EuiSmallButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem />
          </EuiFlexGroup>
        </EuiForm>
      </div>
    </div>
  );
};
