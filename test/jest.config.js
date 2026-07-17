/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
process.env.TZ = 'UTC';
module.exports = {
  rootDir: '../',
  setupFiles: [
    '<rootDir>/test/polyfills.js',
    '<rootDir>/test/setupTests.js',
    '<rootDir>/test/enzyme.js',
  ],
  setupFilesAfterEnv: ['jest-location-mock', '<rootDir>/test/setup.jest.js'],
  modulePaths: ['node_modules', `../../node_modules`],
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mocks/styleMock.js',
    '\\.(css|less|scss)$': '<rootDir>/test/mocks/styleMock.js',
    '^ui/(.*)': '<rootDir>/../../src/legacy/ui/public/$1/',
    // query-string v9 is pure ESM; this shim restores the default-import shape
    // (`import qs from 'query-string'`) under Jest's CJS transform.
    '^query-string$': '<rootDir>/test/mocks/queryStringMock.js',
    // Jest 30 honors the package `exports` field, so '@mapbox/mapbox-gl-draw'
    // now resolves to its pure-ESM './index.js' instead of its legacy CJS
    // `main` (dist/mapbox-gl-draw.js). Point it back at the prebuilt UMD dist
    // bundle, which is CJS-compatible and loads without ESM transformation.
    '^@mapbox/mapbox-gl-draw$':
      '<rootDir>/node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js',
  },
  snapshotSerializers: ['../../node_modules/enzyme-to-json/serializer'],
  coverageReporters: ['lcov', 'text', 'cobertura'],
  testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
  coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/', '<rootDir>/test/'],
  clearMocks: true,
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  modulePathIgnorePatterns: [],
  // query-string v9 and its ESM-only deps must be babel-transformed so the
  // queryStringMock's require of the real package does not re-throw the ESM
  // "Cannot use import statement outside a module" SyntaxError.
  transformIgnorePatterns: [
    '[/\\\\]node_modules(?![/\\\\](query-string|decode-uri-component|filter-obj|split-on-first))[/\\\\].+\\.js$',
  ],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost:5601',
  },
  // Retain Jest 28 snapshot defaults; Jest 29 flipped escapeString and printBasicPrototype to false,
  // which would invalidate existing snapshots. See https://jestjs.io/docs/upgrading-to-jest29
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
