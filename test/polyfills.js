/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { TextEncoder, TextDecoder } from 'util';
import { MutationObserver } from './polyfills/mutationObserver';

// jsdom does not provide TextEncoder/TextDecoder, which maplibre-gl 6.x uses at
// module load. Polyfill them from Node's `util` before any maplibre import.
Object.assign(global, { TextEncoder, TextDecoder });

Object.defineProperty(window, 'MutationObserver', { value: MutationObserver });

document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});
