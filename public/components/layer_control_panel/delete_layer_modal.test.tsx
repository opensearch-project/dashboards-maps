/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteLayerModal } from './delete_layer_modal';
import React from 'react';
import { EuiConfirmModal } from '@elastic/eui';
import TestRenderer from 'react-test-renderer';

describe('test delete layer modal', function () {
  it('should show modal', function () {
    const deleteLayerModal = TestRenderer.create(
      <DeleteLayerModal layerName={'test-layer'} onCancel={() => {}} onConfirm={() => {}} />
    );
    const testInstance = deleteLayerModal.root;
    expect(testInstance.findByType(EuiConfirmModal).props.title).toBe('Delete layer');
    expect(testInstance.findByType(EuiConfirmModal).props.confirmButtonText).toBe('Delete');
    expect(testInstance.findByType(EuiConfirmModal).props.cancelButtonText).toBe('Cancel');
    expect(testInstance.findByType(EuiConfirmModal).props.buttonColor).toBe('danger');
    expect(testInstance.findByType(EuiConfirmModal).props.defaultFocusedButton).toBe('confirm');
  });
});
