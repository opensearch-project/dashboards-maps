import React from 'react';
import { LegendItem } from './legend_item';
import { LegendOption } from './index';
import { EuiHorizontalRule } from '@elastic/eui';

interface Props {
  legend: LegendOption;
  isLastOne: boolean;
}

export const LegendList = ({ legend, isLastOne }: Props) => {
  return (
    <>
      <div className="legend-title">{legend.title}</div>
      {legend.list.map((item) => {
        return <LegendItem color={item.color} label={item.label} />;
      })}
      {isLastOne ? null : <EuiHorizontalRule margin="xs" />}
    </>
  );
};
