import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { cloneDeep } from 'lodash';
import { LegendList } from './legend_list';
import './index.scss';
import { MapLayerSpecification } from '../../../model/mapLayerType';
import { DASHBOARDS_MAPS_LAYER_TYPE, LAYER_VISIBILITY } from '../../../../common';

interface Props {
  layers: MapLayerSpecification[];
  zoom: number;
}

export interface LegendOption {
  id: string;
  title: string;
  list: {
    label: string;
    color: string;
  }[];
}

export interface MapsLegendHandle {
  updateLegends: (legend: LegendOption, isEmpty: boolean) => void;
  deleteLegend: (id: string) => void;
}

const MapsLegend = forwardRef<MapsLegendHandle, Props>(({layers, zoom}, ref) => {
  const [legends, setLegends] = useState<LegendOption[]>([]);
  useImperativeHandle(
    ref,
    () => {
      return {
        updateLegends: (option: LegendOption, isEmpty: boolean) => {
          const newLegends = cloneDeep(legends);
          const { id } = option;
          const index = newLegends.findIndex((item) => item.id === id);
          if (index === -1) {
            if (!isEmpty) {
              newLegends.push(option);
            }
          } else {
            if (isEmpty) {
              newLegends.splice(index, 1);
            } else {
              newLegends.splice(index, 1, option);
            }
          }
          setLegends(newLegends);
        },
        deleteLegend: (layerId: string) => {
          const newLegends = cloneDeep(legends);
          const index = newLegends.findIndex((item) => item.id === layerId);
          if (index > -1) {
            newLegends.splice(index, 1);
          }
          setLegends(newLegends);
        },
      };
    },
    [legends, setLegends]
  );

  const visibleLegends = legends.filter(item => {
    const layer = layers.find(l => l.id === item.id);
    return layer &&
      layer.type === DASHBOARDS_MAPS_LAYER_TYPE.CLUSTER &&
      layer.visibility === LAYER_VISIBILITY.VISIBLE &&
      zoom >= layer.zoomRange[0] &&
      zoom <= layer.zoomRange[1];
  });

  if (visibleLegends.length === 0) {
    return null;
  }

  return (
    <div className="maps-legends">
      {visibleLegends.map((item, index) => {
        const layer = layers.find(l => l.id === item.id);
        return <LegendList
          legend={item}
          key={index}
          isLastOne={index === visibleLegends.length - 1}
          layer={layer!}
        />;
      })}
    </div>
  );
});

export { MapsLegend };
