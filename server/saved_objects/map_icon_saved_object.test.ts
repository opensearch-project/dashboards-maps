/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { mapIconSavedObjectsType, MAP_ICON_SAVED_OBJECT_TYPE } from './map_icon_saved_object';

describe('mapIconSavedObjectsType', () => {
  it('should have the correct type name', () => {
    expect(mapIconSavedObjectsType.name).toBe('map-icon');
    expect(MAP_ICON_SAVED_OBJECT_TYPE).toBe('map-icon');
  });

  it('should not be hidden', () => {
    expect(mapIconSavedObjectsType.hidden).toBe(false);
  });

  it('should be single namespace (tenant-scoped)', () => {
    expect(mapIconSavedObjectsType.namespaceType).toBe('single');
  });

  it('should be importable and exportable', () => {
    expect(mapIconSavedObjectsType.management?.importableAndExportable).toBe(true);
  });

  it('should use name as default search field', () => {
    expect(mapIconSavedObjectsType.management?.defaultSearchField).toBe('name');
  });

  it('should have correct mappings', () => {
    const properties = mapIconSavedObjectsType.mappings?.properties;
    expect(properties).toHaveProperty('name');
    expect(properties).toHaveProperty('svg');
  });

  it('getTitle should return the icon name', () => {
    const mockObj = {
      id: 'test-id',
      type: 'map-icon',
      attributes: { name: 'My Custom Icon' },
      references: [],
    };
    const title = mapIconSavedObjectsType.management?.getTitle?.(mockObj);
    expect(title).toBe('My Custom Icon');
  });

  it('getInAppUrl should return correct path', () => {
    const mockObj = {
      id: 'test-icon-id',
      type: 'map-icon',
      attributes: { name: 'Test Icon' },
      references: [],
    };
    const result = mapIconSavedObjectsType.management?.getInAppUrl?.(mockObj);
    expect(result?.path).toContain('/app/maps-dashboards#/icons/test-icon-id');
  });
});
