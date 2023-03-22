import { Map as Maplibre, AttributionControl, RasterSourceSpecification } from 'maplibre-gl';
import { CustomLayerSpecification, OSMLayerSpecification } from './mapLayerType';
import { hasLayer, removeLayers } from './map/layer_operations';

interface MaplibreRef {
  current: Maplibre | null;
}

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

const addNewLayer = (layerConfig: CustomLayerSpecification, maplibreRef: MaplibreRef) => {
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
    maplibreInstance.addLayer({
      id: layerConfig.id,
      type: 'raster',
      source: layerConfig.id,
      paint: {
        'raster-opacity': layerConfig.opacity / 100,
      },
      layout: {
        visibility: layerConfig.visibility === 'visible' ? 'visible' : 'none',
      },
      minzoom: layerConfig.zoomRange[0],
      maxzoom: layerConfig.zoomRange[1],
    });
  }
};

const getCustomMapURL = (layerConfig: CustomLayerSpecification) => {
  const layerSource = layerConfig?.source;
  if (layerSource?.customType === 'tms') {
    return layerSource?.url;
  } else if (layerSource?.customType === 'wms') {
    const referenceSystemName = layerSource.version === '1.3.0' ? 'crs' : 'srs';
    return `${layerSource?.url}?service=WMS&version=${layerSource.version}&request=GetMap&format=${layerSource.format}&transparent=true&layers=${layerSource?.layers}&styles=${layerSource.styles}&${referenceSystemName}=${layerSource.crs}&width=256&height=256&bbox={bbox-epsg-3857}`;
  } else {
    return '';
  }
};

export const CustomLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: CustomLayerSpecification) => {
    return hasLayer(maplibreRef.current!, layerConfig.id)
      ? updateLayerConfig(layerConfig, maplibreRef)
      : addNewLayer(layerConfig, maplibreRef);
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    removeLayers(maplibreRef.current!, layerConfig.id, true);
  },
};
