/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './maps_explorer_editor.scss';
import 'brace/mode/json';

import React, { useEffect, useMemo, useRef } from 'react';
import { EventEmitter } from 'events';

import { EditorRenderProps } from '../../../../src/plugins/visualize/public';
import { Vis, VisualizeEmbeddableContract } from '../../../../src/plugins/visualizations/public';
import {
  OpenSearchDashboardsContextProvider,
} from '../../../../src/plugins/opensearch_dashboards_react/public';
import { Storage } from '../../../../src/plugins/opensearch_dashboards_utils/public';
import { LayerControl } from './layer_control';
import { DEFAULT_MAP_EXPLORER_VIS_PARAMS } from '../common/types';

const localStorage = new Storage(window.localStorage);

function MapsExplorerEditor({
  core,
  data,
  vis,
  uiState,
  timeRange,
  filters,
  query,
  embeddableHandler,
  eventEmitter,
  linked,
  savedSearch,
}: EditorRenderProps & {
  vis: Vis;
  eventEmitter: EventEmitter;
  embeddableHandler: VisualizeEmbeddableContract;
}) {
  const visRef = useRef<HTMLDivElement>(null);


  /**
   * useMemo will executate during redenering
   * It will display the default base map image after initialization
   */
  useMemo(() => {
    alert("hello!");
    if (vis.params.layerIdOrder === undefined) {
      vis.setState({
        ...vis.serialize(),
        params: DEFAULT_MAP_EXPLORER_VIS_PARAMS
      })
    }
    console.log("vis");
    console.log(vis);
  }, []);

  useEffect(() => {
    if (!visRef.current) {
      return;
    }

    embeddableHandler.render(visRef.current);
    setTimeout(() => {
      eventEmitter.emit('embeddableRendered');
    });

    return () => embeddableHandler.destroy();
  }, [embeddableHandler, eventEmitter]);

  useEffect(() => {
    embeddableHandler.updateInput({
      timeRange,
      filters,
      query,
    });
  }, [embeddableHandler, timeRange, filters, query]);

  return (
    <core.i18n.Context>
      <OpenSearchDashboardsContextProvider
        services={{
          appName: 'maps_explorer_editor',
          storage: localStorage,
          data,
          ...core,
        }}
      >
        <div
          className="layerPanel__container"
          style={{ maxHeight: visRef.current?.clientHeight - 100 }}
        >
          <LayerControl
            embeddableHandler={embeddableHandler}
            vis={vis}
            uiState={uiState}
            isLinkedSearch={linked}
            savedSearch={savedSearch}
            timeRange={timeRange}
            eventEmitter={eventEmitter}
          />
        </div>
        <div className="visEditor__canvas" ref={visRef} data-shared-items-container />
      </OpenSearchDashboardsContextProvider>
    </core.i18n.Context>
  );
}

// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export { MapsExplorerEditor as default };
