/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayerBasicSettings } from './layer_basic_settings';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE, MAX_LAYER_NAME_LIMIT } from '../../../common';
import { shallow } from 'enzyme';
import {
  EuiCompressedDualRange,
  EuiCompressedFieldText,
  EuiCompressedFormRow,
  EuiRange,
  EuiCompressedTextArea
} from '@elastic/eui';

describe('LayerBasicSettings', () => {
  let wrapper: any;
  const mockLayerConfig: MapLayerSpecification = {
    name: 'Test Layer',
    id: 'test-layer',
    type: DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP,
    description: 'Some description',
    zoomRange: [1, 20],
    visibility: 'visible',
    opacity: 80,
  };

  const mockProps = {
    selectedLayerConfig: mockLayerConfig,
    setSelectedLayerConfig: jest.fn(),
    setIsUpdateDisabled: jest.fn(),
    isLayerExists: jest.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(<LayerBasicSettings {...mockProps} />);
  });

  it('should render with correct props', () => {
    expect(wrapper.find(EuiCompressedFieldText).prop('value')).toBe(mockLayerConfig.name);
    expect(wrapper.find(EuiCompressedTextArea).prop('value')).toBe(mockLayerConfig.description);
    expect(wrapper.find(EuiCompressedDualRange).prop('value')).toEqual(mockLayerConfig.zoomRange);
    expect(wrapper.find(EuiRange).prop('value')).toEqual(mockLayerConfig.opacity);
  });

  it('should call setSelectedLayerConfig with updated zoom range on zoom level change', () => {
    const newZoomRange = [2, 15];
    wrapper.find(EuiCompressedDualRange).simulate('change', newZoomRange);

    expect(mockProps.setSelectedLayerConfig).toHaveBeenCalledWith({
      ...mockLayerConfig,
      zoomRange: newZoomRange,
    });
  });

  it('should call setSelectedLayerConfig with updated opacity on opacity change', () => {
    const newOpacity = 50;
    wrapper.find(EuiRange).simulate('change', { target: { value: newOpacity.toString() } });

    expect(mockProps.setSelectedLayerConfig).toHaveBeenCalledWith({
      ...mockLayerConfig,
      opacity: newOpacity,
    });
  });

  it('should call setSelectedLayerConfig with updated name on name change', () => {
    const newName = 'Updated Test Layer';
    wrapper.find(EuiCompressedFieldText).simulate('change', { target: { value: newName } });

    expect(mockProps.setSelectedLayerConfig).toHaveBeenCalledWith({
      ...mockLayerConfig,
      name: newName,
    });
  });

  it('should call setSelectedLayerConfig with updated description on description change', () => {
    const newDescription = 'Updated description';
    wrapper.find(EuiCompressedTextArea).simulate('change', { target: { value: newDescription } });

    expect(mockProps.setSelectedLayerConfig).toHaveBeenCalledWith({
      ...mockLayerConfig,
      description: newDescription,
    });
  });

  it('should display an error for an empty name', () => {
    mockProps.isLayerExists.mockReturnValue(false); // Ensure this returns false for this test
    const emptyName = '';
    wrapper.find(EuiCompressedFieldText).simulate('change', { target: { value: emptyName } });

    wrapper.update();

    expect(wrapper.find(EuiCompressedFormRow).first().prop('error')).toContain('Name cannot be empty');
  });

  it('should display an error for a name exceeding the maximum length', () => {
    const longName = 'a'.repeat(MAX_LAYER_NAME_LIMIT + 1); // Create a name longer than MAX_LAYER_NAME_LIMIT
    wrapper.find(EuiCompressedFieldText).simulate('change', { target: { value: longName } });

    wrapper.update();

    expect(wrapper.find(EuiCompressedFormRow).first().prop('error')).toContain(
      `Name should be less than ${MAX_LAYER_NAME_LIMIT} characters`
    );
  });

  it('should display an error for a name that already exists', () => {
    mockProps.isLayerExists.mockReturnValue(true); // Simulate that the name already exists
    const existingName = 'Existing Layer Name';
    wrapper.find(EuiCompressedFieldText).simulate('change', { target: { value: existingName } });

    wrapper.update();

    expect(wrapper.find(EuiCompressedFormRow).first().prop('error')).toContain('Name already exists');
  });
});
