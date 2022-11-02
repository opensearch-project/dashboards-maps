import React, { useEffect } from 'react';
import { EuiFormRow, EuiColorPicker, useColorPickerState } from '@elastic/eui';
import { ILayerConfig } from '../../model/ILayerConfig';

interface Props {
  selectedLayerConfig: ILayerConfig;
  setSelectedLayerConfig: Function;
}

export const DocumentLayerStyle = ({ setSelectedLayerConfig, selectedLayerConfig }: Props) => {
  const [color, setColor, errors] = useColorPickerState(
    selectedLayerConfig?.style?.circleColor || '#D36086'
  );
  useEffect(() => {
    setSelectedLayerConfig({
      ...selectedLayerConfig,
      style: {
        ...selectedLayerConfig?.style,
        circleColor: color,
      },
    });
  }, [color]);

  return (
    <EuiFormRow label="Point color" isInvalid={!!errors} error={errors}>
      <EuiColorPicker onChange={setColor} color={color} />
    </EuiFormRow>
  );
};
