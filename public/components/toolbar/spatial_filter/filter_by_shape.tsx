/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButtonIcon, EuiContextMenu, EuiPanel, EuiPopover } from '@elastic/eui';
import React, { useState } from 'react';
import {
  DRAW_FILTER_CANCEL,
  DRAW_FILTER_SHAPE_TITLE,
  DRAW_FILTER_SPATIAL_RELATIONS,
  DrawFilterProperties,
  FILTER_DRAW_MODE,
} from '../../../../common';
import { FilterInputPanel } from './filter_input_panel';

interface FilterByShapeProps {
  setDrawFilterProperties: (properties: DrawFilterProperties) => void;
  mode: FILTER_DRAW_MODE;
  shapeMode: FILTER_DRAW_MODE;
  shapeLabel: string;
  defaultLabel: string;
  iconType: any;
  isDarkMode: boolean;
}

export const FilterByShape = ({
  shapeMode,
  setDrawFilterProperties,
  mode,
  defaultLabel,
  iconType,
  shapeLabel,
  isDarkMode,
}: FilterByShapeProps) => {
  const [isPopoverOpen, setPopover] = useState(false);
  const isFilterActive: boolean = mode === shapeMode;

  const onClick = () => {
    if (isFilterActive) {
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
          drawLabel={shapeLabel}
          defaultFilterLabel={defaultLabel}
          relations={DRAW_FILTER_SPATIAL_RELATIONS}
          onSubmit={onSubmit}
          mode={shapeMode}
        />
      ),
    },
  ];

  const drawShapeButton = (
    <EuiPanel paddingSize="none" className="spatialFilterToolbar__shape">
      <EuiButtonIcon
        isSelected={isFilterActive}
        display={isFilterActive ? 'fill' : 'empty'}
        aria-pressed={isFilterActive}
        color={isDarkMode ? 'ghost' : 'primary'}
        size={'s'}
        iconType={iconType}
        onClick={onClick}
        aria-label={'draw_filter_shape'}
        title={isFilterActive ? DRAW_FILTER_CANCEL : shapeLabel}
        className={'spatialFilterToolbar__shapeButton'}
      />
    </EuiPanel>
  );
  return (
    <EuiPopover
      id="drawShapeId"
      button={drawShapeButton}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      panelPaddingSize="none"
      anchorPosition="leftUp"
      data-test-subj="drawShapePopOver"
    >
      <EuiContextMenu initialPanelId={0} panels={panels} size="s" />
    </EuiPopover>
  );
};
