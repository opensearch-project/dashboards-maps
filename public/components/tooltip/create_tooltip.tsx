import React from 'react';
import ReactDOM from 'react-dom';
import { Popup, MapGeoJSONFeature } from 'maplibre-gl';

import { MapLayerSpecification, DocumentLayerSpecification } from '../../model/mapLayerType';
import { FeatureGroupItem, TooltipContainer } from './tooltipContainer';

type Options = {
  features: MapGeoJSONFeature[];
  layers: DocumentLayerSpecification[];
  showCloseButton?: boolean;
  showPagination?: boolean;
  showLayerSelection?: boolean;
};

export function isTooltipEnabledLayer(
  layer: MapLayerSpecification
): layer is DocumentLayerSpecification {
  return layer.type !== 'opensearch_vector_tile_map' && layer.source.showTooltips === true;
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

export function getPopupLngLat(geometry: GeoJSON.Geometry) {
  // geometry.coordinates is different for different geometry.type, here we use the geometry.coordinates
  // of a Point as the position of the popup. For other types, such as Polygon, MultiPolygon, etc,
  // use mouse position should be better
  if (geometry.type === 'Point') {
    return [geometry.coordinates[0], geometry.coordinates[1]] as [number, number];
  } else {
    return null;
  }
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
  });

  const featureGroup = groupFeaturesByLayers(features, layers);

  // Don't show popup if no feature
  if (featureGroup.length === 0) {
    return null;
  }

  const div = document.createElement('div');
  ReactDOM.render(
    <TooltipContainer
      featureGroup={featureGroup}
      onClose={popup.remove}
      showCloseButton={showCloseButton}
      showPagination={showPagination}
      showLayerSelection={showLayerSelection}
    />,
    div
  );

  return popup.setDOMContent(div);
}
