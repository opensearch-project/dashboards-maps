/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiButtonEmpty,
  EuiToolTip,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { i18n } from '@osd/i18n';

import { Vis } from 'src/plugins/visualizations/public';
import { discardChanges, EditorAction } from '../../../../../src/plugins/vis_default_editor/public';
import './layer_control_buttons.scss'
import { ConfigMode } from './layer_control';

interface LayerControlButtonsProps {
  isDirty: boolean;
  isInvalid: boolean;
  isTouched: boolean;
  dispatch: React.Dispatch<EditorAction>;
  vis: Vis;
  applyChanges(): void;
  configMode: ConfigMode;
  setConfigLayerId: (configLayerId: string | undefined) => void;
}

/**
 * UI of the create/update and discard/cancel buttons in layer control
 * @param param0 
 * @returns 
 */
function LayerControlButtons({
  isDirty,
  isInvalid,
  isTouched,
  dispatch,
  vis,
  applyChanges,
  configMode,
  setConfigLayerId,
}: LayerControlButtonsProps) {
  const onClickDiscard = useCallback(() => {
    dispatch(discardChanges(vis))
    setConfigLayerId(undefined);
  }, [dispatch, vis, configMode]);
  const onClickCreateAndUpdate = useCallback(() => {
    applyChanges();
  }, [applyChanges]);

  return (
    <div className="layerControl__buttons">
      <EuiFlexGroup justifyContent="spaceBetween" gutterSize="none" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty
            data-test-subj="layerControlDiscardButton"
            iconType={"cross"}
            onClick={onClickDiscard}
            size="s"
          >
            {(configMode === 'edit' && !isDirty) ? <FormattedMessage
              id="layerControl.button.cancelButtonLabel"
              defaultMessage="Cancel"
            /> : <FormattedMessage
              id="layerControl.button.discardButtonLabel"
              defaultMessage="Discard"
            />}
          </EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          {/* when inputs are invalid and after clciking the creat button, display tooltip */}
          {isInvalid && isTouched ? (
            <EuiToolTip
              content={i18n.translate('layerControl.button.errorButtonTooltip', {
                defaultMessage: 'Errors in the input fields need to be resolved.',
              })}
            >
              <EuiButton color="danger" iconType="alert" size="s" disabled>
                {configMode === 'create' ? <FormattedMessage
                  id="layerControl.button.createChartButtonLabel"
                  defaultMessage="Create & Save"
                /> : <FormattedMessage
                  id="layerControl.button.updateChartButtonLabel"
                  defaultMessage="Update & Save"
                />}
              </EuiButton>
            </EuiToolTip>
          ) : (
            <EuiButton
              data-test-subj="layerControlUpdateButton"
              disabled={!isDirty}
              fill
              iconType="play"
              onClick={onClickCreateAndUpdate}
              size="s"
            >
              {configMode === 'create' ? <FormattedMessage
                id="layerControl.button.createChartButtonLabel"
                defaultMessage="Create & Save"
              /> : <FormattedMessage
                id="layerControl.button.updateChartButtonLabel"
                defaultMessage="Update & Save"
              />}
            </EuiButton>
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}

export { LayerControlButtons };
