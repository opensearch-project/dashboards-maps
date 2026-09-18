/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Built-in map icons. Each icon uses `currentColor` for fill and stroke so
 * that fill color and outline color can be applied at render time.
 *
 * Icons come in two style variants controlled by the caller:
 *   filled  – shape has a solid fill
 *   outline – shape has no fill, only a stroke outline
 *
 * The SVG templates use placeholder tokens:
 *   FILL_COLOR   – replaced with the user's chosen fill color
 *   STROKE_COLOR – replaced with the user's chosen outline color
 */

export interface MapIcon {
  id: string;
  name: string;
  /** SVG template using FILL_COLOR and STROKE_COLOR tokens */
  svg: string;
}

// ─── General ─────────────────────────────────────────────────────────────────

const pin: MapIcon = {
  id: 'pin',
  name: 'Pin',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
};

const circle: MapIcon = {
  id: 'circle',
  name: 'Circle',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><circle cx="12" cy="12" r="10"/></svg>`,
};

const square: MapIcon = {
  id: 'square',
  name: 'Square',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
};

const diamond: MapIcon = {
  id: 'diamond',
  name: 'Diamond',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>`,
};

const star: MapIcon = {
  id: 'star',
  name: 'Star',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
};

const triangle: MapIcon = {
  id: 'triangle',
  name: 'Triangle',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M12 3L2 21h20L12 3z"/></svg>`,
};

const home: MapIcon = {
  id: 'home',
  name: 'Home',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
};

// ─── Transportation ───────────────────────────────────────────────────────────

const airport: MapIcon = {
  id: 'airport',
  name: 'Airport',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
};

const ship: MapIcon = {
  id: 'ship',
  name: 'Ship',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>`,
};

const truck: MapIcon = {
  id: 'truck',
  name: 'Truck',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
};

// ─── Services ─────────────────────────────────────────────────────────────────

const hospital: MapIcon = {
  id: 'hospital',
  name: 'Hospital',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>`,
};

const restaurant: MapIcon = {
  id: 'restaurant',
  name: 'Restaurant',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`,
};

const school: MapIcon = {
  id: 'school',
  name: 'School',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>`,
};

const shopping: MapIcon = {
  id: 'shopping',
  name: 'Shopping',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
};

// ─── Nature ───────────────────────────────────────────────────────────────────

const park: MapIcon = {
  id: 'park',
  name: 'Park',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M17 12h2L12 2 5 12h2l-3 6h7v4h2v-4h7l-3-6z"/></svg>`,
};

// ─── Status ───────────────────────────────────────────────────────────────────

const warning: MapIcon = {
  id: 'warning',
  name: 'Warning',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
};

const check: MapIcon = {
  id: 'check',
  name: 'Check',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
};

const factory: MapIcon = {
  id: 'factory',
  name: 'Factory',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M22 22H2V10l7-3v2l5-3v3l8-4v17z"/></svg>`,
};

const cross: MapIcon = {
  id: 'cross',
  name: 'Cross',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="STROKE_WIDTH"><path d="M9 2v7H2v6h7v7h6v-7h7V9h-7V2H9z"/></svg>`,
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const ALL_BUILT_IN_ICONS: MapIcon[] = [
  pin, circle, square, diamond, star, triangle, cross, home,
  airport, ship, truck,
  hospital, restaurant, school, shopping,
  park,
  warning, check, factory,
];

export const getBuiltInIconById = (id: string): MapIcon | undefined =>
  ALL_BUILT_IN_ICONS.find((icon) => icon.id === id);

export const DEFAULT_ICON_ID = 'pin';

export const DEFAULT_ICON_FILL_COLOR = '#2196F3';
export const DEFAULT_ICON_STROKE_COLOR = '#FFFFFF';
export const DEFAULT_ICON_STROKE_WIDTH = 1;

/**
 * Apply fill and stroke colors to an SVG template.
 * Supports two styles:
 *   filled  – shape filled with fillColor, outlined with strokeColor
 *   outline – shape has no fill (transparent), outlined with strokeColor
 */
export const applyIconColors = (
  svgTemplate: string,
  fillColor: string,
  strokeColor: string,
  style: 'filled' | 'outline' = 'filled'
): string => {
  const effectiveFill = style === 'outline' ? 'none' : fillColor;
  return svgTemplate
    .replace(/FILL_COLOR/g, effectiveFill)
    .replace(/STROKE_COLOR/g, strokeColor)
    .replace(/STROKE_WIDTH/g, String(DEFAULT_ICON_STROKE_WIDTH));
};
