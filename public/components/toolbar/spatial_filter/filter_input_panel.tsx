/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EuiButton, EuiCompressedFieldText, EuiForm, EuiFormRow, EuiPanel, EuiSelect } from '@elastic/eui';
import { FILTER_DRAW_MODE } from '../../../../common';

const getSpatialRelationshipItems = (
  relations: string[]
): Array<{ value: string; text: string }> => {
  return relations.map((relation) => {
    return {
      value: relation,
      text: relation,
    };
  });
};

export interface FilterInputProps {
  drawLabel: string;
  defaultFilterLabel: string;
  mode: FILTER_DRAW_MODE;
  readonly relations: string[];
  onSubmit: ({
    relation,
    label,
    mode,
  }: {
    relation: string;
    label: string;
    mode: FILTER_DRAW_MODE;
  }) => void;
}

export const FilterInputPanel = ({
  drawLabel,
  defaultFilterLabel,
  mode,
  relations,
  onSubmit,
}: FilterInputProps) => {
  const [filterLabel, setFilterLabel] = useState<string>(defaultFilterLabel);
  const [spatialRelation, setSpatialRelation] = useState<string>(relations[0]);

  const updateSpatialFilterProperties = () => {
    onSubmit({
      relation: spatialRelation,
      label: filterLabel,
      mode,
    });
  };

  return (
    <EuiPanel className={'spatialFilterGroup__popoverPanel'}>
      <EuiForm>
        <EuiFormRow label="Filter label" display="rowCompressed">
          <EuiCompressedFieldText
            name="filterLabel"
            value={filterLabel}
            onChange={(event) => {
              setFilterLabel(event.target.value);
            }}
            compressed
          />
        </EuiFormRow>

        <EuiFormRow label="Spatial relation" display="rowCompressed">
          <EuiSelect
            options={getSpatialRelationshipItems(relations)}
            onChange={(event) => {
              setSpatialRelation(event.target.value);
            }}
            value={spatialRelation}
            compressed
          />
        </EuiFormRow>
        <EuiFormRow display="rowCompressed">
          <EuiButton
            fullWidth
            size="s"
            fill
            aria-label={drawLabel}
            data-test-subj="add-draw-button"
            onClick={updateSpatialFilterProperties}
          >
            {drawLabel}
          </EuiButton>
        </EuiFormRow>
      </EuiForm>
    </EuiPanel>
  );
};
