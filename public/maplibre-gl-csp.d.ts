/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// The CSP-safe build (`maplibre-gl/dist/maplibre-gl-csp`) ships without a
// dedicated `.d.ts`. Its runtime API matches `maplibre-gl`, so we re-export
// the main package's types. We import the CSP build for its non-blob worker
// behavior; pair with `setWorkerUrl(...)` to point at the shipped worker asset.
declare module 'maplibre-gl/dist/maplibre-gl-csp' {
  export * from 'maplibre-gl';
}
