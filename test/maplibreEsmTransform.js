/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// Jest transformer for maplibre-gl 6.x, which ships only ESM `.mjs`. We compile
// it to CommonJS so Jest (CJS) can load it, and neutralize `import.meta` (used
// by maplibre only to derive a default worker URL, never exercised in jsdom)
// which would otherwise throw "Cannot use 'import.meta' outside a module".
const babelJest = require('babel-jest').default || require('babel-jest');

const replaceImportMeta = () => ({
  visitor: {
    MetaProperty(path) {
      path.replaceWithSourceString("({ url: '' })");
    },
  },
});

module.exports = babelJest.createTransformer({
  babelrc: false,
  configFile: false,
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  plugins: [replaceImportMeta],
});
