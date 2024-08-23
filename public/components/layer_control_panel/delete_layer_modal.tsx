/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiConfirmModal, EuiText } from '@elastic/eui';
import React from 'react';

interface DeleteLayerModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  layerName: string;
}
export const DeleteLayerModal = ({ onCancel, onConfirm, layerName }: DeleteLayerModalProps) => {
  return (
    <EuiConfirmModal
      title={
        <EuiText size="s">
          <h2>Delete layer</h2>
        </EuiText>
      }
      onCancel={onCancel}
      onConfirm={onConfirm}
      cancelButtonText="Cancel"
      confirmButtonText="Delete"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <EuiText size="s">
        <p>
          Do you want to delete layer <strong>{layerName}</strong>?
        </p>
      </EuiText>
    </EuiConfirmModal>
  );
};
