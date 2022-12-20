/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SimpleSavedObject } from 'opensearch-dashboards/public';
import { IndexPattern, Query, TimeRange } from '../../../../../src/plugins/data/public';
import { DASHBOARDS_MAPS_LAYER_TYPE, PLUGIN_ID } from '../../../common';
import { getTopNavConfig } from './get_top_nav_config';
import { useOpenSearchDashboards } from '../../../../../src/plugins/opensearch_dashboards_react/public';
import { MapServices } from '../../types';
import { MapSavedObjectAttributes } from '../../../common/map_saved_object_attributes';
import { getSavedMapBreadcrumbs } from '../../utils/breadcrumbs';
import { doDataLayerRender } from '../../model/DataLayerController';
import { MapLayerSpecification } from '../../model/mapLayerType';
import { MapState } from '../../model/mapState';

interface MapTopNavMenuProps {
  mapIdFromUrl: string;
  layers: MapLayerSpecification[];
  savedMapObject: SimpleSavedObject<MapSavedObjectAttributes> | null | undefined;
  layersIndexPatterns: IndexPattern[];
  maplibreRef: any;
  mapState: MapState;
  setMapState: (mapState: MapState) => void;
}

export const MapTopNavMenu = ({
  mapIdFromUrl,
  savedMapObject,
  layers,
  layersIndexPatterns,
  maplibreRef,
  mapState,
  setMapState,
}: MapTopNavMenuProps) => {
  const { services } = useOpenSearchDashboards<MapServices>();
  const {
    setHeaderActionMenu,
    navigation: {
      ui: { TopNavMenu },
    },
    chrome,
    application: { navigateToApp },
  } = services;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [queryConfig, setQueryConfig] = useState<Query>({ query: '', language: 'kuery' });
  const [refreshIntervalValue, setRefreshIntervalValue] = useState<number>(60000);
  const [isRefreshPaused, setIsRefreshPaused] = useState<boolean>(false);
  const changeTitle = useCallback(
    (newTitle: string) => {
      chrome.setBreadcrumbs(getSavedMapBreadcrumbs(newTitle, navigateToApp));
      chrome.docTitle.change(newTitle);
    },
    [chrome, navigateToApp]
  );

  useEffect(() => {
    if (savedMapObject) {
      setTitle(savedMapObject.attributes.title);
      setDescription(savedMapObject.attributes.description!);
    }
  }, [savedMapObject, mapIdFromUrl]);

  useEffect(() => {
    changeTitle(title || 'Create');
  }, [title, changeTitle]);

  const refreshDataLayerRender = useCallback(() => {
    layers.forEach((layer: MapLayerSpecification) => {
      if (layer.type === DASHBOARDS_MAPS_LAYER_TYPE.OPENSEARCH_MAP) {
        return;
      }
      doDataLayerRender(layer, mapState, services, maplibreRef);
    });
  }, [layers, mapState, maplibreRef, services]);

  const handleQuerySubmit = ({ query, dateRange }: { query?: Query; dateRange: TimeRange }) => {
    if (query) {
      setMapState({ ...mapState, query });
    }
    if (dateRange) {
      setMapState({ ...mapState, timeRange: dateRange });
    }
  };

  useEffect(() => {
    setDateFrom(mapState.timeRange.from);
    setDateTo(mapState.timeRange.to);
    setQueryConfig(mapState.query);
    setIsRefreshPaused(mapState.refreshInterval.pause);
    setRefreshIntervalValue(mapState.refreshInterval.value);
    refreshDataLayerRender();
  }, [mapState, refreshDataLayerRender]);

  return (
    <TopNavMenu
      appName={PLUGIN_ID}
      config={getTopNavConfig(services, {
        mapIdFromUrl,
        layers,
        title,
        description,
        setTitle,
        setDescription,
        mapState,
      })}
      setMenuMountPoint={setHeaderActionMenu}
      indexPatterns={layersIndexPatterns || []}
      showSearchBar
      showFilterBar={false}
      showDatePicker={true}
      showQueryBar={true}
      showSaveQuery={true}
      showQueryInput={true}
      onQuerySubmit={handleQuerySubmit}
      useDefaultBehaviors
      dateRangeFrom={dateFrom}
      dateRangeTo={dateTo}
      query={queryConfig}
      isRefreshPaused={isRefreshPaused}
      refreshInterval={refreshIntervalValue}
    />
  );
};
