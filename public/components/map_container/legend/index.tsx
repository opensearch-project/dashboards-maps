import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { cloneDeep } from 'lodash';
import { LegendList } from './legend_list';
import './index.scss';

interface Props {}

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

const MapsLegend = forwardRef<MapsLegendHandle, Props>(({}, ref) => {
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
        //delete legend when deleting a cluster layer
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

  return legends.length > 0 ? (
    <div className="maps-legends">
      {legends.map((item, index) => {
        return <LegendList legend={item} key={index} isLastOne={index === legends.length - 1} />;
      })}
    </div>
  ) : null;
});

export { MapsLegend };
