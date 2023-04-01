/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EuiPopover, EuiContextMenu, EuiPanel, EuiButtonIcon } from '@elastic/eui';
import { FilterInputPanel } from './filter_input_panel';
import polygon from '../../../images/polygon.svg';
import {
  DrawFilterProperties,
  DRAW_FILTER_POLYGON,
  DRAW_FILTER_POLYGON_DEFAULT_LABEL,
  DRAW_FILTER_SPATIAL_RELATIONS,
  DRAW_FILTER_SHAPE_TITLE, DRAW_FILTER_CANCEL,
} from '../../../../common';
import { FILTER_DRAW_MODE } from '../../../../common';

interface FilterByPolygonProps {
  setDrawFilterProperties: (properties: DrawFilterProperties) => void;
  mode: FILTER_DRAW_MODE;
}

const isFilterActive = (mode: FILTER_DRAW_MODE): boolean => {
  return mode === FILTER_DRAW_MODE.POLYGON;
};

export const FilterByPolygon = ({ setDrawFilterProperties, mode }: FilterByPolygonProps) => {
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
          drawLabel={DRAW_FILTER_POLYGON}
          defaultFilterLabel={DRAW_FILTER_POLYGON_DEFAULT_LABEL}
          relations={DRAW_FILTER_SPATIAL_RELATIONS}
          onSubmit={onSubmit}
          mode={FILTER_DRAW_MODE.POLYGON}
        />
      ),
    },
  ];

  const drawPolygonButton = (
    <EuiPanel paddingSize="none" className="spatialFilterToolbar__shape">
      <EuiButtonIcon
        isSelected={isFilterActive(mode)}
        display={isFilterActive(mode) ? 'fill' : 'empty'}
        aria-pressed={isFilterActive(mode)}
        color="primary"
        size={'s'}
        iconType={polygon}
        onClick={onClick}
        aria-label={'draw_filter_polygon'}
        title={isFilterActive(mode) ? DRAW_FILTER_CANCEL : DRAW_FILTER_POLYGON}
      />
    </EuiPanel>
  );
  return (
    <EuiPopover
      id="drawPolygonId"
      button={drawPolygonButton}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      panelPaddingSize="none"
      anchorPosition="leftUp"
      data-test-subj="drawPolygonPopOver"
    >
      <EuiContextMenu initialPanelId={0} panels={panels} />
    </EuiPopover>
  );
};
