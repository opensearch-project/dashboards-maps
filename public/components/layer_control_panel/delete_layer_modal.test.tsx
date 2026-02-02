/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteLayerModal } from './delete_layer_modal';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('test delete layer modal', function () {
  it('should show modal', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    
    render(<DeleteLayerModal layerName={'test-layer'} onCancel={onCancel} onConfirm={onConfirm} />);
    
    expect(screen.getByText('Delete layer')).toBeTruthy();
    expect(screen.getByText(/Do you want to delete layer/)).toBeTruthy();
    expect(screen.getByText('test-layer')).toBeTruthy();
    expect(screen.getByText('Delete')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });
});
