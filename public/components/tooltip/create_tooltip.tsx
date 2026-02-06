import React from 'react';
import { createRoot } from 'react-dom/client';
import { Popup, MapGeoJSONFeature, LngLat } from 'maplibre-gl';

import { MapLayerSpecification, DocumentLayerSpecification } from '../../model/mapLayerType';
import { FeatureGroupItem, TooltipContainer } from './tooltipContainer';
import { MAX_LONGITUDE } from '../../../common';
import './create_tooltip.scss';

interface Options {
  features: MapGeoJSONFeature[];
  layers: DocumentLayerSpecification[];
  showCloseButton?: boolean;
  showPagination?: boolean;
  showLayerSelection?: boolean;
}

export function isTooltipEnabledLayer(
  layer: MapLayerSpecification
): layer is DocumentLayerSpecification {
  return (
    layer.type !== 'opensearch_vector_tile_map' &&
    layer.type !== 'custom_map' &&
    layer.source.showTooltips === true &&
    !!layer.source.tooltipFields?.length
  );
}

export function isTooltipEnabledOnHover(
  layer: MapLayerSpecification
): layer is DocumentLayerSpecification {
  return isTooltipEnabledLayer(layer) && (layer.source?.displayTooltipsOnHover ?? true);
}

export function groupFeaturesByLayers(
  features: MapGeoJSONFeature[],
  layers: DocumentLayerSpecification[]
) {
  const featureGroups: FeatureGroupItem[] = [];
  if (layers.length > 0) {
    layers.forEach((layer) => {
      const layerFeatures = features.filter((f) => f.layer.source === layer.id);
      if (layerFeatures.length > 0) {
        featureGroups.push({ features: layerFeatures, layer });
      }
    });
  }
  return featureGroups;
}

export function getPopupLocation(geometry: GeoJSON.Geometry, mousePoint: LngLat) {
  // geometry.coordinates is different for different geometry.type, here we use the geometry.coordinates
  // of a Point as the position of the popup. For other types, such as Polygon, MultiPolygon, etc,
  // use mouse position should be better
  if (geometry.type !== 'Point') {
    return mousePoint;
  }
  const coordinates = geometry.coordinates;
  // Copied from https://maplibre.org/maplibre-gl-js-docs/example/popup-on-click/
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(mousePoint.lng - coordinates[0]) > MAX_LONGITUDE) {
    coordinates[0] += mousePoint.lng > coordinates[0] ? 360 : -360;
  }
  return [coordinates[0], coordinates[1]] as [number, number];
}

export function createPopup({
  features,
  layers,
  showCloseButton = true,
  showPagination = true,
  showLayerSelection = true,
}: Options) {
  const popup = new Popup({
    closeButton: false,
    closeOnClick: false,
    maxWidth: 'max-content',
    className: 'mapTooltip',
  });

  const featureGroup = groupFeaturesByLayers(features, layers);

  // Don't show popup if no feature
  if (featureGroup.length === 0) {
    return null;
  }

  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <TooltipContainer
      featureGroup={featureGroup}
      onClose={popup.remove}
      showCloseButton={showCloseButton}
      showPagination={showPagination}
      showLayerSelection={showLayerSelection}
    />
  );

  return popup.setDOMContent(div);
}
