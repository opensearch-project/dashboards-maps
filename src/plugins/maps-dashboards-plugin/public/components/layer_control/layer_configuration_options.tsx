/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import { SelectOption, TextInputOption } from '../../../../../src/plugins/charts/public';
import { VisOptionsProps } from "../../../../../src/plugins/vis_default_editor/public";
import { LayerOptions, LayerTypeOptions, LayerTypes, } from "../../common/types";
import { ConfigMode } from "./layer_control";
import { WmsConfigurationOptions } from "./layers_config_options/wms_configuration_options";
import { EuiDualRange, EuiSpacer, EuiText } from "@elastic/eui";
import {DEFAULT_CONFIGURATION_MINZOOM, DEFAULT_CONFIGURATION_MAXZOOM, DEFAULT_CONFIGURATION_STEP} from "../../common/constants/option"

const LAYER_TYPE = "layerType";

/**
 * Contain all Layers' options
 * Key is layer's id
 * Value is the corresponding layer's options
 */
interface MapsExplorerLayersOptions {
  [id: string]: LayerOptions;
}

/**
 * Schema of stateParams
 */
export interface MapsExplorerVisParams {
  layersOptions: MapsExplorerLayersOptions
  layerIdOrder: string[]; // The order of layer ids, from the bottom to the top
}

export type MapsExlorerOptionsProps = VisOptionsProps<MapsExplorerVisParams> & {
  configLayerId: string;
  configMode: ConfigMode;
};

/**
 * Sidebar UI to configure each layer
 * @param props 
 * @returns 
 */
function LayerConfigurationOptions(props: MapsExlorerOptionsProps) {
  const { stateParams, setValue, vis, setValidity, configLayerId, configMode } = props;
  // specific layer's input options validity
  const [optionValidity, setOptionValidity] = useState(true);

  //update layer's options
  const setLayerValue = <T extends keyof LayerOptions>(paramName: T, value: LayerOptions[T]) => {
    // during the creatation, when users switch layer type from other types to TMS, 
    //set optionValidity True to ensure users are able to creat new TMS layer
    if (LAYER_TYPE === paramName) { setOptionValidity(true); };
    setValue("layersOptions", {
      ...stateParams.layersOptions,
      [configLayerId]: {
        ...stateParams.layersOptions[configLayerId],
        [paramName]: value
      }
    });
  }

  // update layer's zoom level
  const setZoom = (levels: [number | string, number | string]) => {
    setValue("layersOptions", {
      ...stateParams.layersOptions,
      [configLayerId]: {
        ...stateParams.layersOptions[configLayerId],
        minZoom: Number(levels[0]),
        maxZoom: Number(levels[1])
      }
    });
  }

  //update the specific layer's options
  const setTypeOptions = <T extends keyof LayerTypeOptions>(paramName: T, value: LayerTypeOptions[T]) =>
    setLayerValue('typeOptions', {
      ...stateParams.layersOptions[configLayerId].typeOptions,
      [paramName]: value,
    });

  // Validate user input
  useEffect(() => {
    if (optionValidity && stateParams.layersOptions[configLayerId].name && stateParams.layersOptions[configLayerId].layerType) {
      setValidity(true);
    } else {
      setValidity(false);
    }
  }, [stateParams, optionValidity]);

  return (
    <>
      <TextInputOption
        label={
          <>
            <FormattedMessage id="mapsExplorer.layerVisParams.nameLabel" defaultMessage="Layer Name" />
            <span aria-hidden="true">*</span>
          </>
        }
        paramName="name"
        value={stateParams.layersOptions[configLayerId].name}
        setValue={setLayerValue}
      />

      <SelectOption
        label={i18n.translate('mapsExplorer.layerVisParams.layerTypeLabel', {
          defaultMessage: 'Layer Type*',
        })}
        options={vis.type.editorConfig.collections.layerTypes}
        paramName="layerType"
        value={stateParams.layersOptions[configLayerId].layerType}
        disabled={configMode === 'edit'}
        setValue={setLayerValue}
      />

      <EuiSpacer size="s"/>

      <EuiText size="xs">
         <strong>
         <FormattedMessage id="mapsExplorer.layerVisParams.zoomLevelLable" defaultMessage="Zoom Level*"/>
           </strong>
      </EuiText>

      <EuiDualRange
        min={DEFAULT_CONFIGURATION_MINZOOM}
        max={DEFAULT_CONFIGURATION_MAXZOOM}
        step={DEFAULT_CONFIGURATION_STEP}
        value={[stateParams.layersOptions[configLayerId].minZoom, stateParams.layersOptions[configLayerId].maxZoom]}
        onChange={setZoom}
        showLabels
        showRange
        showInput="inputWithPopover"
        aria-label="Zoom level"
      />

      {stateParams.layersOptions[configLayerId].layerType === LayerTypes.WMSLayer &&
        <WmsConfigurationOptions
          wms={stateParams.layersOptions[configLayerId].typeOptions}
          setTypeOptions={setTypeOptions}
          setOptionValidity={setOptionValidity}
        />
      }
    </>
  )
}

export { LayerConfigurationOptions };

