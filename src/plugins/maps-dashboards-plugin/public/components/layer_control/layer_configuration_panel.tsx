/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './layer_configuration_panel.scss';
import { i18n } from '@osd/i18n';
import React, { useState } from "react";
import { DefaultEditorNavBar, OptionTab } from "../../../../../src/plugins/vis_default_editor/public";
import { LayerConfigurationOptions } from "./layer_configuration_options";
import { ConfigMode } from "./layer_control";

interface LayerConfigurationPanelProps {
  dataTabProps: any;
  optionTabProps: any;
  configLayerId: string | undefined;
  configMode: ConfigMode;
}

/**
 * Layer configuration panel UI
 * Users can edit the layer name in this panel
 * @param param0 
 * @returns 
 */
function LayerConfigurationPanel({
  dataTabProps,
  optionTabProps,
  configLayerId,
  configMode
}: LayerConfigurationPanelProps) {
  const [selectedTab, setSelectedTab] = useState('options');

  const [optionTabs, setOptionTabs] = useState<OptionTab[]>([{
    editor: LayerConfigurationOptions,
    name: 'options',
    title: i18n.translate('visDefaultEditor.sidebar.tabs.optionsLabel', {
      defaultMessage: 'Options',
    }),
    isSelected: true
  }])

  return (
    <>
      <DefaultEditorNavBar optionTabs={optionTabs} setSelectedTab={setSelectedTab} />
      {optionTabs.map(({ editor: Editor, name, isSelected = false }) => (
        <div
          key={name}
          className={`visEditorSidebar__config ${isSelected ? '' : 'visEditorSidebar__config-isHidden'
            }`}
        >
          <Editor
            isTabSelected={isSelected}
            {...(name === 'data' ? dataTabProps : optionTabProps)}
            configLayerId={configLayerId}
            configMode={configMode}
          />
        </div>
      ))}
    </>
  )
}

export { LayerConfigurationPanel };
