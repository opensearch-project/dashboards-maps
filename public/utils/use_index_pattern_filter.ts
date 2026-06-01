/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { SavedObjectsClientContract, SimpleSavedObject } from '../../../../src/core/public';

const EXCLUDED_ENGINE_TYPES = ['AnalyticEngine'];

/**
 * Returns a synchronous filter function for IndexPatternSelect that excludes
 * index patterns backed by unsupported data source engine types, along with a loading flag.
 */
export const useIndexPatternFilter = (
  savedObjectsClient: SavedObjectsClientContract
): { filter: (indexPattern: SimpleSavedObject<any>) => boolean; loading: boolean } => {
  const [blockedDataSourceIds, setBlockedDataSourceIds] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    savedObjectsClient
      .find<{ dataSourceEngineType?: string }>({ type: 'data-source', perPage: 10000 })
      .then((response) => {
        if (cancelled) return;
        const blocked = new Set<string>();
        for (const ds of response.savedObjects) {
          if (
            ds.attributes.dataSourceEngineType &&
            EXCLUDED_ENGINE_TYPES.includes(ds.attributes.dataSourceEngineType)
          ) {
            blocked.add(ds.id);
          }
        }
        setBlockedDataSourceIds(blocked);
      })
      .catch(() => {
        // Fail-open: if fetch fails, allow all index patterns
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [savedObjectsClient]);

  const filter = useCallback(
    (indexPattern: SimpleSavedObject<any>) => {
      if (!blockedDataSourceIds?.size) return true;
      const dsRef = indexPattern.references?.find(
        (ref: { type: string }) => ref.type === 'data-source'
      );
      return !dsRef || !blockedDataSourceIds.has(dsRef.id);
    },
    [blockedDataSourceIds]
  );

  return { filter, loading };
};
