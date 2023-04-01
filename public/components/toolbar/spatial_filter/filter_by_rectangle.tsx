/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EuiButtonIcon, EuiContextMenu, EuiPanel, EuiPopover } from '@elastic/eui';
import { FilterInputPanel } from './filter_input_panel';
import {
  DRAW_FILTER_CANCEL,
  DRAW_FILTER_RECTANGLE,
  DRAW_FILTER_RECTANGLE_DEFAULT_LABEL,
  DRAW_FILTER_SHAPE_TITLE,
  DRAW_FILTER_SPATIAL_RELATIONS,
  DrawFilterProperties,
  FILTER_DRAW_MODE,
} from '../../../../common';

interface FilterByRectangleProps {
  setDrawFilterProperties: (properties: DrawFilterProperties) => void;
  mode: FILTER_DRAW_MODE;
}

const isFilterActive = (mode: FILTER_DRAW_MODE): boolean => {
  return mode === FILTER_DRAW_MODE.RECTANGLE;
};

export const FilterByRectangle = ({ setDrawFilterProperties, mode }: FilterByRectangleProps) => {
  const [isPopoverOpen, setPopover] = useState(false);

  const onClick = () => {
    if (isFilterActive(mode)) {
      setDrawFilterProperties({
        mode: FILTER_DRAW_MODE.NONE,
      });
      return;
    }
    setPopover(!isPopoverOpen);
  };

  const closePopover = () => {
    setPopover(false);
  };

  const onSubmit = (input: { relation: string; label: string; mode: FILTER_DRAW_MODE }) => {
    setDrawFilterProperties({
      mode: input.mode,
      relation: input.relation,
      filterLabel: input.label,
    });
    closePopover();
  };

  const panels = [
    {
      id: 0,
      title: DRAW_FILTER_SHAPE_TITLE,
      content: (
        <FilterInputPanel
          drawLabel={DRAW_FILTER_RECTANGLE}
          defaultFilterLabel={DRAW_FILTER_RECTANGLE_DEFAULT_LABEL}
          relations={DRAW_FILTER_SPATIAL_RELATIONS}
          onSubmit={onSubmit}
          mode={FILTER_DRAW_MODE.RECTANGLE}
        />
      ),
    },
  ];

  const drawRectangleButton = (
    <EuiPanel paddingSize="none" className="spatialFilterToolbar__shape">
      <EuiButtonIcon
        isSelected={isFilterActive(mode)}
        display={isFilterActive(mode) ? 'fill' : 'empty'}
        aria-pressed={isFilterActive(mode)}
        color={'primary'}
        size={'s'}
        iconType={'vector'}
        onClick={onClick}
        aria-label={'draw_filter_rectangle'}
        title={isFilterActive(mode) ? DRAW_FILTER_CANCEL : DRAW_FILTER_RECTANGLE}
      />
    </EuiPanel>
  );
  return (
    <EuiPopover
      id="drawRectangleId"
      button={drawRectangleButton}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      panelPaddingSize="none"
      anchorPosition="leftUp"
      data-test-subj="drawRectanglePopOver"
    >
      <EuiContextMenu initialPanelId={0} panels={panels} />
    </EuiPopover>
  );
};
