/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SimpleSavedObject } from '../../../../../src/core/public';
import { IndexPattern, Query, TimeRange } from '../../../../../src/plugins/data/public';
import { DASHBOARDS_MAPS_LAYER_TYPE, MAPS_APP_ID } from '../../../common';
import { getTopNavConfig } from './get_top_nav_config';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { getSavedMapBreadcrumbs } from '../../utils/breadcrumbs';
import { handleDataLayerRender } from '../../model/layerRenderController';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { MapState } from '../../model/mapState';
import { HeaderVariant } from '../../../../../src/core/public';
import { TopNavMenuItemRenderType } from '../../../../../src/plugins/navigation/public';

interface MapTopNavMenuProps {
  mapIdFromUrl: string;
  layers: MapLayerSpecification[];
  savedMapObject: SimpleSavedObject<MapSavedObjectAttributes> | null | undefined;
  layersIndexPatterns: IndexPattern[];
  maplibreRef: any;
  mapState: MapState;
  setMapState: (mapState: MapState) => void;
  originatingApp?: string;
  setIsUpdatingLayerRender: (isUpdatingLayerRender: boolean) => void;
}

export const MapTopNavMenu = ({
  mapIdFromUrl,
  savedMapObject,
  layers,
  layersIndexPatterns,
  maplibreRef,
  mapState,
  setMapState,
  setIsUpdatingLayerRender,
}: MapTopNavMenuProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    setHeaderActionMenu,
    navigation: {
      ui: { TopNavMenu },
    },
    chrome,
    application: { navigateToApp },
    embeddable,
    scopedHistory,
    uiSettings,
  } = services;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [queryConfig, setQueryConfig] = useState<Query>({ query: '', language: 'kuery' });
  const [refreshIntervalValue, setRefreshIntervalValue] = useState<number>(60000);
  const [isRefreshPaused, setIsRefreshPaused] = useState<boolean>(false);
  const [originatingApp, setOriginatingApp] = useState<string>();
  const changeTitle = useCallback(
    (newTitle: string) => {
      chrome.setBreadcrumbs(getSavedMapBreadcrumbs(newTitle, navigateToApp));
      chrome.docTitle.change(newTitle);
    },
    [chrome, navigateToApp]
  );
  const showActionsInGroup = uiSettings.get('home:useNewHomePage');

  useEffect(() => {
    if (showActionsInGroup) {
      chrome.setHeaderVariant?.(HeaderVariant.APPLICATION);
    }

    return () => {
      chrome.setHeaderVariant?.();
    };
  }, [chrome.setHeaderVariant, showActionsInGroup]);

  useEffect(() => {
    const { originatingApp: value } =
      embeddable
        .getStateTransfer(scopedHistory)
        .getIncomingEditorState({ keysToRemoveAfterFetch: ['id', 'input'] }) || {};
    setOriginatingApp(value);
  }, [embeddable, scopedHistory]);

  useEffect(() => {
    if (savedMapObject) {
      setTitle(savedMapObject.attributes.title);
      setDescription(savedMapObject.attributes.description!);
    }
  }, [savedMapObject, mapIdFromUrl]);

  useEffect(() => {
    changeTitle(title || 'Create');
  }, [title, changeTitle]);

  const refreshDataLayerRender = () => {
    layers.forEach((layer: MapLayerSpecification) => {
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.DOCUMENTS) {
        handleDataLayerRender(layer, mapState, services, maplibreRef);
      }
    });
  };

  const handleQuerySubmit = ({ query, dateRange }: { query?: Query; dateRange: TimeRange }) => {
    setIsUpdatingLayerRender(true);
    const updatedMapState = {
      ...mapState,
      ...(query && { query }),
      ...(dateRange && { timeRange: dateRange }),
    };
    setMapState(updatedMapState);
  };

  useEffect(() => {
    setDateFrom(mapState.timeRange.from);
    setDateTo(mapState.timeRange.to);
    setQueryConfig(mapState.query);
    setIsRefreshPaused(mapState.refreshInterval.pause);
    setRefreshIntervalValue(mapState.refreshInterval.value);
  }, [mapState.timeRange, mapState.query, mapState.refreshInterval]);

  const onRefreshChange = useCallback(
    ({ isPaused, refreshInterval }: { isPaused: boolean; refreshInterval: number }) => {
      setIsRefreshPaused(isPaused);
      setRefreshIntervalValue(refreshInterval);
    },
    []
  );

  const config = useMemo(() => {
    return getTopNavConfig(services, {
      mapIdFromUrl,
      layers,
      title,
      description,
      setTitle,
      setDescription,
      mapState,
      originatingApp,
      showActionsInGroup,
    });
  }, [services, mapIdFromUrl, layers, title, description, mapState, originatingApp]);

  return (
    // @ts-ignore
    <TopNavMenu
      appName={MAPS_APP_ID}
      config={config}
      setMenuMountPoint={setHeaderActionMenu}
      indexPatterns={layersIndexPatterns || []}
      showSearchBar={TopNavMenuItemRenderType.IN_PORTAL}
      showFilterBar={false}
      showDatePicker={true}
      showQueryBar={true}
      showSaveQuery={true}
      showQueryInput={true}
      onQuerySubmit={handleQuerySubmit}
      dateRangeFrom={dateFrom}
      dateRangeTo={dateTo}
      query={queryConfig}
      isRefreshPaused={isRefreshPaused}
      refreshInterval={refreshIntervalValue}
      onRefresh={refreshDataLayerRender}
      onRefreshChange={onRefreshChange}
      groupActions={showActionsInGroup}
      screenTitle={title}
    />
  );
};
