/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderHook, act } from '@testing-library/react';
import { useIndexPatternFilter } from './use_index_pattern_filter';

describe('useIndexPatternFilter', () => {
  const createMockSavedObjectsClient = (
    dataSources: Array<{ id: string; attributes: { dataSourceEngineType?: string } }>
  ) => ({
    find: jest.fn().mockResolvedValue({
      savedObjects: dataSources.map((ds) => ({
        id: ds.id,
        type: 'data-source',
        attributes: ds.attributes,
      })),
    }),
  });

  it('reports loading state initially', () => {
    const client = createMockSavedObjectsClient([]) as any;
    const { result } = renderHook(() => useIndexPatternFilter(client));

    expect(result.current.loading).toBe(true);
  });

  it('reports loading false after fetch resolves', async () => {
    const client = createMockSavedObjectsClient([]) as any;
    const { result } = renderHook(() => useIndexPatternFilter(client));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
  });

  it('filters out index patterns linked to blocked data sources', async () => {
    const client = createMockSavedObjectsClient([
      { id: 'ds-blocked', attributes: { dataSourceEngineType: 'AnalyticEngine' } },
      { id: 'ds-allowed', attributes: { dataSourceEngineType: 'OpenSearch' } },
    ]) as any;

    const { result } = renderHook(() => useIndexPatternFilter(client));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const { filter } = result.current;

    // Index pattern referencing blocked data source
    expect(
      filter({
        id: 'ip-1',
        references: [{ type: 'data-source', id: 'ds-blocked' }],
      } as any)
    ).toBe(false);

    // Index pattern referencing allowed data source
    expect(
      filter({
        id: 'ip-2',
        references: [{ type: 'data-source', id: 'ds-allowed' }],
      } as any)
    ).toBe(true);

    // Index pattern with no data source reference (local cluster)
    expect(
      filter({
        id: 'ip-3',
        references: [],
      } as any)
    ).toBe(true);
  });

  it('allows all index patterns when fetch fails', async () => {
    const client = {
      find: jest.fn().mockRejectedValue(new Error('fetch failed')),
    } as any;

    const { result } = renderHook(() => useIndexPatternFilter(client));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(
      result.current.filter({
        id: 'any-id',
        references: [{ type: 'data-source', id: 'any-ds' }],
      } as any)
    ).toBe(true);
  });
});
