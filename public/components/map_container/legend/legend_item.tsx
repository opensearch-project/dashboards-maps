import React from 'react';
import { EuiText, EuiIcon } from '@elastic/eui';

interface Props {
  color: string;
  label: string;
}

export const LegendItem = ({ color, label }: Props) => {
  return (
    <div className="legend-item">
      <EuiIcon type="dot" color={color} />
      <EuiText className="legend-label">{label}</EuiText>
    </div>
  );
};
