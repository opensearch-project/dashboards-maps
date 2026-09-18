/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  EuiCompressedFormRow,
  EuiSpacer,
  EuiCompressedFieldNumber,
  EuiFormLabel,
  EuiButtonGroup,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { DocumentLayerSpecification } from '../../../../model/mapLayerType';
import { IndexPattern } from '../../../../../../../src/plugins/data/common';
import { IconPicker } from './icon_picker';
import { ColorPicker } from './color_picker';
import {
  DEFAULT_ICON_ID,
  DEFAULT_ICON_FILL_COLOR,
  DEFAULT_ICON_STROKE_COLOR,
  getBuiltInIconById,
} from '../../../map_icons';

interface IconConfigProps {
  selectedLayerConfig: DocumentLayerSpecification;
  setSelectedLayerConfig: Function;
  setIsUpdateDisabled: Function;
  indexPattern: IndexPattern | null | undefined;
}

const DEFAULT_ICON_SIZE = 24;
const MIN_ICON_SIZE = 8;
const MAX_ICON_SIZE = 64;

const styleTogglePrefix = 'iconStyleToggle';

export const IconConfig = ({
  selectedLayerConfig,
  setSelectedLayerConfig,
  setIsUpdateDisabled,
  indexPattern,
}: IconConfigProps) => {
  const iconConfig = selectedLayerConfig?.style?.iconConfig;
  const iconId = iconConfig?.iconId || DEFAULT_ICON_ID;
  const iconSize = iconConfig?.iconSize || DEFAULT_ICON_SIZE;
  const iconStyle = iconConfig?.iconStyle || 'filled';
  const fillColor = iconConfig?.fillColor || DEFAULT_ICON_FILL_COLOR;
  const strokeColor = iconConfig?.strokeColor || DEFAULT_ICON_STROKE_COLOR;

  const [hasInvalidSize, setHasInvalidSize] = useState(false);
  const [toggleStyleIdSelected, setToggleStyleIdSelected] = useState(
    `${styleTogglePrefix}__${iconStyle === 'outline' ? 'Outline' : 'Filled'}`
  );

  useEffect(() => {
    setHasInvalidSize(iconSize < MIN_ICON_SIZE || iconSize > MAX_ICON_SIZE);
  }, [iconSize]);

  useEffect(() => {
    setIsUpdateDisabled(hasInvalidSize);
  }, [hasInvalidSize]);

  const updateIconConfig = useCallback(
    (updates: Partial<DocumentLayerSpecification['style']['iconConfig']>) => {
      setSelectedLayerConfig({
        ...selectedLayerConfig,
        style: {
          ...selectedLayerConfig?.style,
          iconConfig: {
            ...selectedLayerConfig?.style?.iconConfig,
            iconId,
            ...updates,
          },
        },
      });
    },
    [selectedLayerConfig, setSelectedLayerConfig, iconId]
  );

  const onIconSelect = (selectedIconId: string, svg?: string) => {
    const builtInIcon = getBuiltInIconById(selectedIconId);
    if (builtInIcon) {
      updateIconConfig({ iconId: selectedIconId, svg: undefined });
    } else {
      updateIconConfig({ iconId: selectedIconId, svg });
    }
  };

  const onIconSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateIconConfig({ iconSize: Number(e.target.value) });
  };

  const onStyleChange = (optionId: string) => {
    setToggleStyleIdSelected(optionId);
    const newStyle = optionId === `${styleTogglePrefix}__Outline` ? 'outline' : 'filled';
    updateIconConfig({ iconStyle: newStyle });
  };

  const onFillColorChange = (color: string) => {
    updateIconConfig({ fillColor: color });
  };

  const onStrokeColorChange = (color: string) => {
    updateIconConfig({ strokeColor: color });
  };

  const styleToggleButtons = [
    {
      id: `${styleTogglePrefix}__Filled`,
      label: i18n.translate('maps.documents.iconStyleFilled', { defaultMessage: 'Filled' }),
    },
    {
      id: `${styleTogglePrefix}__Outline`,
      label: i18n.translate('maps.documents.iconStyleOutline', { defaultMessage: 'Outline' }),
    },
  ];

  // Determine if selected icon is a built-in (show color controls) or custom
  const isBuiltIn = !!getBuiltInIconById(iconId);

  return (
    <>
      <EuiCompressedFormRow
        label={i18n.translate('maps.documents.selectIcon', {
          defaultMessage: 'Icon',
        })}
        fullWidth={true}
      >
        <IconPicker selectedIconId={iconId} onIconSelect={onIconSelect} />
      </EuiCompressedFormRow>
      <EuiSpacer size="s" />
      {isBuiltIn && (
        <>
          <EuiCompressedFormRow
            label={i18n.translate('maps.documents.iconStyle', {
              defaultMessage: 'Style',
            })}
            fullWidth={true}
          >
            <EuiButtonGroup
              name="iconStyleButtonGroup"
              legend="Icon style"
              options={styleToggleButtons}
              idSelected={toggleStyleIdSelected}
              onChange={onStyleChange}
              buttonSize="compressed"
            />
          </EuiCompressedFormRow>
          <EuiSpacer size="s" />
          {iconStyle === 'filled' && (
            <ColorPicker
              originColor={fillColor}
              label={i18n.translate('maps.documents.iconFillColor', {
                defaultMessage: 'Fill color',
              })}
              selectedLayerConfigId={selectedLayerConfig.id}
              setIsUpdateDisabled={setIsUpdateDisabled}
              onColorChange={onFillColorChange}
            />
          )}
          <ColorPicker
            originColor={strokeColor}
            label={i18n.translate('maps.documents.iconStrokeColor', {
              defaultMessage: 'Outline color',
            })}
            selectedLayerConfigId={selectedLayerConfig.id}
            setIsUpdateDisabled={setIsUpdateDisabled}
            onColorChange={onStrokeColorChange}
          />
          <EuiSpacer size="s" />
        </>
      )}
      <EuiCompressedFormRow
        label={i18n.translate('maps.documents.iconSize', {
          defaultMessage: 'Icon size',
        })}
        fullWidth={true}
        isInvalid={hasInvalidSize}
        error={i18n.translate('maps.documents.style.invalidIconSize', {
          defaultMessage: 'Must be between {min} and {max}',
          values: { min: MIN_ICON_SIZE, max: MAX_ICON_SIZE },
        })}
      >
        <EuiCompressedFieldNumber
          value={iconSize}
          onChange={onIconSizeChange}
          isInvalid={hasInvalidSize}
          append={<EuiFormLabel>px</EuiFormLabel>}
          fullWidth={true}
          min={MIN_ICON_SIZE}
          max={MAX_ICON_SIZE}
        />
      </EuiCompressedFormRow>
    </>
  );
};
