
/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import 'brace/mode/json';

import React, { useState, useMemo, useCallback } from 'react';

import { EuiFormRow, EuiIconTip, EuiCodeEditor, EuiScreenReaderOnly } from '@elastic/eui';
import { i18n } from '@osd/i18n';

import 'brace/theme/github';

interface Props {
  setValue: (value: string) => void;
  value: string;
  showValidation?: boolean;
  setValidity: (validity: boolean) => void;
}

function JsonEditor({
                      showValidation = false,
                      value = '',
                      setValidity = () => {},
                      setValue,
                    }: Props) {
  const [isFieldValid, setFieldValidity] = useState(true);
  const [editorReady, setEditorReady] = useState(false);

  const editorTooltipText = useMemo(
    () =>
      i18n.translate('maps.controls.jsonInputTooltip', {
        defaultMessage:
          "Any JSON formatted properties you add will be merged with the OpenSearch aggregation definition for this section. For example, 'shard_size' on a terms aggregation.",
      }),
    []
  );

  const jsonEditorLabelText = useMemo(
    () =>
      i18n.translate('maps.controls.jsonInputLabel', {
        defaultMessage: 'JSON input',
      }),
    []
  );

  const label = useMemo(
    () => (
      <>
        {jsonEditorLabelText}{' '}
        <EuiIconTip position="right" content={editorTooltipText} type="questionInCircle" />
      </>
    ),
    [jsonEditorLabelText, editorTooltipText]
  );

  const onEditorValidate = useCallback(
    (annotations: unknown[]) => {
      // The first onValidate returned from EuiCodeEditor is a false negative
      if (editorReady) {
        const validity = annotations.length === 0;
        setFieldValidity(validity);
        setValidity(validity);
      } else {
        setEditorReady(true);
      }
    },
    [setValidity, editorReady]
  );

  return (
    <EuiFormRow
      label={label}
      isInvalid={showValidation ? !isFieldValid : false}
      fullWidth={true}
      display={'rowCompressed'}
    >
      <>
        <EuiCodeEditor
          mode="json"
          theme="github"
          width="100%"
          height="250px"
          value={value}
          onValidate={onEditorValidate}
          setOptions={{
            fontSize: '14px',
          }}
          onChange={setValue}
          aria-label={jsonEditorLabelText}
          aria-describedby="jsonEditorDescription"
        />
        <EuiScreenReaderOnly>
          <p id="jsonEditorDescription">{editorTooltipText}</p>
        </EuiScreenReaderOnly>
      </>
    </EuiFormRow>
  );
}

export { JsonEditor };
