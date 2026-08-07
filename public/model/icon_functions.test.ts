/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ALL_BUILT_IN_ICONS,
  getBuiltInIconById,
  DEFAULT_ICON_ID,
} from '../components/map_icons';

describe('Default Icons', () => {
  it('should have at least 10 built-in icons', () => {
    expect(ALL_BUILT_IN_ICONS.length).toBeGreaterThan(10);
  });

  it('should return an icon by id', () => {
    const icon = getBuiltInIconById('pin');
    expect(icon).toBeDefined();
    expect(icon!.name).toBe('Pin');
    expect(icon!.svg).toContain('<svg');
  });

  it('should return undefined for unknown icon id', () => {
    const icon = getBuiltInIconById('nonexistent-icon');
    expect(icon).toBeUndefined();
  });

  it('should have a valid DEFAULT_ICON_ID that resolves', () => {
    const icon = getBuiltInIconById(DEFAULT_ICON_ID);
    expect(icon).toBeDefined();
  });

  it('all icons should have required fields', () => {
    ALL_BUILT_IN_ICONS.forEach((icon) => {
      expect(icon.id).toBeTruthy();
      expect(icon.name).toBeTruthy();
      expect(icon.svg).toBeTruthy();
    });
  });

  it('all icons should have unique ids', () => {
    const ids = ALL_BUILT_IN_ICONS.map((icon) => icon.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all SVGs should be valid SVG template strings', () => {
    ALL_BUILT_IN_ICONS.forEach((icon) => {
      expect(icon.svg).toContain('<svg');
      expect(icon.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(icon.svg).toContain('</svg>');
      expect(icon.svg).toContain('FILL_COLOR');
      expect(icon.svg).toContain('STROKE_COLOR');
    });
  });
});
