import { Map as Maplibre, AttributionControl, RasterSourceSpecification } from 'maplibre-gl';
import { CustomLayerSpecification, OSMLayerSpecification } from './mapLayerType';
import { getMaplibreBeforeLayerId, layerExistInMbSource } from './layersFunctions';

interface MaplibreRef {
  current: Maplibre | null;
}

const getCurrentStyleLayers = (maplibreRef: MaplibreRef) => {
  return maplibreRef.current?.getStyle().layers || [];
};

const updateLayerConfig = (layerConfig: CustomLayerSpecification, maplibreRef: MaplibreRef) => {
  const maplibreInstance = maplibreRef.current;
  if (maplibreInstance) {
    const customLauer = maplibreInstance.getLayer(layerConfig.id);
    if (customLauer) {
      maplibreInstance.setPaintProperty(
        layerConfig.id,
        'raster-opacity',
        layerConfig.opacity / 100
      );
      maplibreInstance.setLayerZoomRange(
        layerConfig.id,
        layerConfig.zoomRange[0],
        layerConfig.zoomRange[1]
      );
      const rasterLayerSource = maplibreInstance.getSource(
        layerConfig.id
      )! as RasterSourceSpecification;
      if (rasterLayerSource.attribution !== layerConfig.source?.attribution) {
        rasterLayerSource.attribution = layerConfig?.source?.attribution;
        maplibreInstance._controls.forEach((control) => {
          if (control instanceof AttributionControl) {
            control._updateAttributions();
          }
        });
      }
      const tilesURL = getCustomMapURL(layerConfig);
      if (rasterLayerSource.tiles![0] !== tilesURL) {
        rasterLayerSource.tiles = [layerConfig?.source?.url];
        maplibreInstance.style.sourceCaches[layerConfig.id].clearTiles();
        maplibreInstance.style.sourceCaches[layerConfig.id].update(maplibreInstance.transform);
        maplibreInstance.triggerRepaint();
      }
    }
  }
};

const addNewLayer = (
  layerConfig: CustomLayerSpecification,
  maplibreRef: MaplibreRef,
  beforeLayerId: string | undefined
) => {
  const maplibreInstance = maplibreRef.current;
  if (maplibreInstance) {
    const tilesURL = getCustomMapURL(layerConfig);
    const layerSource = layerConfig?.source;
    maplibreInstance.addSource(layerConfig.id, {
      type: 'raster',
      tiles: [tilesURL],
      tileSize: 256,
      attribution: layerSource?.attribution,
    });
    const beforeMbLayerId = getMaplibreBeforeLayerId(layerConfig, maplibreRef, beforeLayerId);
    maplibreInstance.addLayer(
      {
        id: layerConfig.id,
        type: 'raster',
        source: layerConfig.id,
      },
      beforeMbLayerId
    );
  }
};

const getCustomMapURL = (layerConfig: CustomLayerSpecification) => {
  const layerSource = layerConfig?.source;
  if (layerSource?.protocol === 'tms') {
    return layerSource?.url;
  } else if (layerSource?.protocol === 'wms') {
    return `${layerSource?.url}?service=WMS&version=${layerSource.version}&request=GetMap&format=${layerSource.format}&transparent=true&layers=${layerSource?.layers}&styles=${layerSource.styles}&SRS=EPSG%3A3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`;
  } else {
    return '';
  }
};

export const CustomLayerFunctions = {
  render: (
    maplibreRef: MaplibreRef,
    layerConfig: CustomLayerSpecification,
    beforeLayerId: string | undefined
  ) => {
    if (layerExistInMbSource(layerConfig.id, maplibreRef)) {
      updateLayerConfig(layerConfig, maplibreRef);
    } else {
      addNewLayer(layerConfig, maplibreRef, beforeLayerId);
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((mbLayer: { id: any }) => {
      if (mbLayer.id.includes(layerConfig.id)) {
        maplibreRef.current?.removeLayer(mbLayer.id);
      }
    });
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    const layers = getCurrentStyleLayers(maplibreRef);
    layers.forEach((mbLayer: { id: any }) => {
      if (mbLayer.id.includes(layerConfig.id)) {
        maplibreRef.current?.setLayoutProperty(mbLayer.id, 'visibility', layerConfig.visibility);
      }
    });
  },
};
