/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiConfirmModal } from '@elastic/eui';
import React from 'react';

interface DeleteLayerModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  layerName: string;
}
export const DeleteLayerModal = ({ onCancel, onConfirm, layerName }: DeleteLayerModalProps) => {
  return (
    <EuiConfirmModal
      title="Delete layer"
      onCancel={onCancel}
      onConfirm={onConfirm}
      cancelButtonText="Cancel"
      confirmButtonText="Delete"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <p>
        Do you want to delete layer <strong>{layerName}</strong>?
      </p>
    </EuiConfirmModal>
  );
};
