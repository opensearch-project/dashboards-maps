/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EuiPopover, EuiContextMenu, EuiPanel, EuiButtonIcon } from '@elastic/eui';
import { FilterInputPanel } from './filter_input_panel';
// TODO: replace with rectangle image file once available
import rectangle from '../../../images/polygon.svg';
import {
  DrawFilterProperties,
  DRAW_FILTER_SPATIAL_RELATIONS,
  DRAW_FILTER_SHAPE_TITLE,
  DRAW_FILTER_RECTANGLE,
  DRAW_FILTER_RECTANGLE_DEFAULT_LABEL,
} from '../../../../common';
import { FILTER_DRAW_MODE } from '../../../../common';

interface FilterByRectangleProps {
  setDrawFilterProperties: (properties: DrawFilterProperties) => void;
  isDrawActive: boolean;
}

export const FilterByRectangle = ({
  setDrawFilterProperties,
  isDrawActive,
}: FilterByRectangleProps) => {
  const [isPopoverOpen, setPopover] = useState(false);

  const onClick = () => {
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
        color="text"
        size={'s'}
        iconType={rectangle}
        onClick={onClick}
        aria-label={'draw_filter_rectangle'}
        title={DRAW_FILTER_RECTANGLE}
        isDisabled={isDrawActive}
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
