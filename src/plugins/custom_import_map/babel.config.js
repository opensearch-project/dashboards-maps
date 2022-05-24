/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
    plugins: [
      require('@babel/plugin-proposal-class-properties'),
      require('@babel/plugin-proposal-object-rest-spread'),
      ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }],
      [require('@babel/plugin-transform-runtime'), { regenerator: true }],
    ],
  };