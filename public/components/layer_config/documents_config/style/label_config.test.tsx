import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { LabelConfig } from './label_config';
import { EuiCheckbox, EuiFormLabel } from '@elastic/eui';
import {
  DOCUMENTS_LARGE_LABEL_BORDER_WIDTH,
  DOCUMENTS_MEDIUM_LABEL_BORDER_WIDTH,
  DOCUMENTS_NONE_LABEL_BORDER_WIDTH,
  DOCUMENTS_SMALL_LABEL_BORDER_WIDTH,
} from '../../../../../common';
import { DocumentLayerSpecification } from '../../../../model/mapLayerType';
import { IndexPattern } from '../../../../../../../src/plugins/data/common';

describe('LabelConfig', () => {
  let wrapper: ShallowWrapper;

  const setSelectedLayerConfigMock = jest.fn();
  const setIsUpdateDisabledMock = jest.fn();

  const mockLayerConfig: DocumentLayerSpecification = {
    name: 'My Document Layer',
    id: 'document-layer-1',
    type: 'documents',
    description: 'A layer of documents',
    zoomRange: [5, 18],
    opacity: 0.8,
    visibility: 'visible',
    source: {
      indexPatternRefName: 'myIndexPattern',
      indexPatternId: '123456',
      geoFieldType: 'geo_point',
      geoFieldName: 'location',
      documentRequestNumber: 1000,
      showTooltips: true,
      tooltipFields: ['field1', 'field2', 'field3'],
      useGeoBoundingBoxFilter: true,
      filters: [],
    },
    style: {
      fillColor: '#FF0000',
      borderColor: '#000000',
      borderThickness: 2,
      markerSize: 10,
      label: {
        enabled: true,
        textByFixed: 'My Label',
        textByField: 'field1',
        textType: 'fixed',
        color: '#FFFFFF',
        size: 12,
        borderColor: '#000000',
        borderWidth: 2,
      },
    },
  };

  const mockIndexPattern = {
    fields: [
      {
        name: 'field1',
        displayName: 'Field 1',
        type: 'text',
      },
      {
        name: 'field2',
        displayName: 'Field 2',
        type: 'geo_point',
      },
    ],
  } as IndexPattern;

  beforeEach(() => {
    wrapper = shallow(
      <LabelConfig
        selectedLayerConfig={mockLayerConfig}
        setSelectedLayerConfig={setSelectedLayerConfigMock}
        setIsUpdateDisabled={setIsUpdateDisabledMock}
        indexPattern={mockIndexPattern}
      />
    );
  });

  it('should render EuiCheckbox with correct props', () => {
    const checkbox = wrapper.find(EuiCheckbox);
    expect(checkbox.prop('label')).toEqual('Add label');
    expect(checkbox.prop('checked')).toEqual(true);
  });

  it('should call setSelectedLayerConfig with updated config when onChangeShowLabel is called', () => {
    const checkbox = wrapper.find(EuiCheckbox);
    checkbox.simulate('change', { target: { checked: false } });
    expect(setSelectedLayerConfigMock).toHaveBeenCalledWith({
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          enabled: false,
        },
      },
    });
  });

  it('should render EuiCheckbox with correct props when enableLabel is false', () => {
    const newSelectedLayerConfig = {
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          enabled: false,
        },
      },
    };
    wrapper.setProps({ selectedLayerConfig: newSelectedLayerConfig });
    const checkbox = wrapper.find(EuiCheckbox);
    expect(checkbox.prop('checked')).toEqual(false);
  });

  it('should call setSelectedLayerConfig with updated config when onChangeLabelTextType is called', () => {
    const select = wrapper.find('EuiSelect').at(0);
    select.simulate('change', { target: { value: 'by_field' } });
    expect(setSelectedLayerConfigMock).toHaveBeenCalledWith({
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          textType: 'by_field',
        },
      },
    });
  });

  it('should render EuiFieldText with correct props when labelTextType is "fixed"', () => {
    const fieldText = wrapper.find('EuiFieldText');
    expect(fieldText.prop('value')).toEqual('My Label');
  });

  it('should render EuiComboBox with correct props when labelTextType is "By field', () => {
    const newSelectedLayerConfig = {
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          textType: 'by_field',
          textByField: 'Field 1',
        },
      },
    };
    wrapper.setProps({ selectedLayerConfig: newSelectedLayerConfig });
    const fieldText = wrapper.find('EuiComboBox');
    expect(fieldText.prop('selectedOptions')).toEqual([{ label: 'Field 1' }]);
  });

  it('should call setSelectedLayerConfig with updated config when onStaticLabelChange is called', () => {
    const fieldText = wrapper.find('EuiFieldText');
    fieldText.simulate('change', { target: { value: 'new label' } });
    expect(setSelectedLayerConfigMock).toHaveBeenCalledWith({
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          textByFixed: 'new label',
        },
      },
    });
  });

  it('should render EuiFieldNumber with correct props', () => {
    const fieldNumber = wrapper.find('EuiFieldNumber');
    expect(fieldNumber.prop('value')).toEqual(12);
    expect(fieldNumber.prop('append')).toEqual(<EuiFormLabel>px</EuiFormLabel>);
    expect(fieldNumber.prop('fullWidth')).toEqual(true);
  });

  it('should call setSelectedLayerConfig with updated config when OnChangeLabelSize is called', () => {
    const fieldNumber = wrapper.find('EuiFieldNumber');
    fieldNumber.simulate('change', { target: { value: 20 } });
    expect(setSelectedLayerConfigMock).toHaveBeenCalledWith({
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          size: 20,
        },
      },
    });
  });

  it('should render ColorPicker with correct props for label color', () => {
    const colorPicker = wrapper.find({ label: 'Label color' });
    expect(colorPicker.prop('originColor')).toEqual('#FFFFFF');
    expect(colorPicker.prop('selectedLayerConfigId')).toEqual(mockLayerConfig.id);
    expect(colorPicker.prop('setIsUpdateDisabled')).toEqual(setIsUpdateDisabledMock);
  });

  it('should render ColorPicker with correct props for label border color', () => {
    const colorPicker = wrapper.find({ label: 'Label border color' });
    expect(colorPicker.prop('originColor')).toEqual('#000000');
    expect(colorPicker.prop('selectedLayerConfigId')).toEqual(mockLayerConfig.id);
    expect(colorPicker.prop('setIsUpdateDisabled')).toEqual(setIsUpdateDisabledMock);
  });

  it('should render EuiSelect with correct props for label border width', () => {
    const select = wrapper.find('EuiSelect').at(1);
    expect(select.prop('options')).toEqual([
      { value: DOCUMENTS_NONE_LABEL_BORDER_WIDTH, text: 'None' },
      { value: DOCUMENTS_SMALL_LABEL_BORDER_WIDTH, text: 'Small' },
      { value: DOCUMENTS_MEDIUM_LABEL_BORDER_WIDTH, text: 'Medium' },
      { value: DOCUMENTS_LARGE_LABEL_BORDER_WIDTH, text: 'Large' },
    ]);
    expect(select.prop('value')).toEqual(2);
    expect(select.prop('fullWidth')).toEqual(true);
  });

  it('should call setSelectedLayerConfig with updated config when onChangeLabelBorderWidth is called', () => {
    const select = wrapper.find('EuiSelect').at(1);
    select.simulate('change', { target: { value: 3 } });
    expect(setSelectedLayerConfigMock).toHaveBeenCalledWith({
      ...mockLayerConfig,
      style: {
        ...mockLayerConfig.style,
        label: {
          ...mockLayerConfig.style.label,
          borderWidth: 3,
        },
      },
    });
  });
});
