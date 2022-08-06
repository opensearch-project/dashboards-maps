/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { EventEmitter } from 'events';
import { EuiErrorBoundary, EuiLoadingChart } from '@elastic/eui';

import { EditorRenderProps } from 'src/plugins/visualize/public';
import { Vis, VisualizeEmbeddableContract } from 'src/plugins/visualizations/public';

const MapsExplorerEditor = lazy(() => import('./maps_explorer_editor'));

class MapsExplorerEditorController {
  constructor(
    private el: HTMLElement,
    private vis: Vis,
    private eventEmitter: EventEmitter,
    private embeddableHandler: VisualizeEmbeddableContract
  ) { }

  render(props: EditorRenderProps) {
    render(
      <EuiErrorBoundary>
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                flex: '1 1 auto',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <EuiLoadingChart size="xl" mono />
            </div>
          }
        >
          <MapsExplorerEditor
            eventEmitter={this.eventEmitter}
            embeddableHandler={this.embeddableHandler}
            vis={this.vis}
            {...props}
          />
        </Suspense>
      </EuiErrorBoundary>,
      this.el
    );
  }

  destroy() {
    unmountComponentAtNode(this.el);
  }
}

export { MapsExplorerEditorController };
