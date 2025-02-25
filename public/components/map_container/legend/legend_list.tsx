import React from 'react';
import { LegendItem } from './legend_item';
import { LegendOption } from './index';
import { EuiHorizontalRule } from '@elastic/eui';
import { MapLayerSpecification } from '../../../model/mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE, LAYER_VISIBILITY } from '../../../../common';

interface Props {
  legend: LegendOption;
  isLastOne: boolean;
  layer: MapLayerSpecification;
}

export const LegendList = ({ legend, isLastOne, layer }: Props) => {
  const isVisibleClusterLayer = layer.type === DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER && layer.visibility === LAYER_VISIBILITY.VISIBLE;

  if (!isVisibleClusterLayer) {
    return null;
  }

  return (
    <>
      <div className="legend-title">{legend.title}</div>
      {legend.list.map((item, index) => {
        return <LegendItem key={index} color={item.color} label={item.label} />;
      })}
      {isLastOne ? null : <EuiHorizontalRule margin="xs" />}
    </>
  );
};
