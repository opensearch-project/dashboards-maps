import { CustomLayerSpecification, OSMLayerSpecification } from './mapLayerType';
import { hasLayer, removeLayers } from './map/layer_operations';
import { MaplibreRef } from './layersFunctions';

const refreshLayer = (layerConfig: CustomLayerSpecification, maplibreRef: MaplibreRef) => {
  const maplibreInstance = maplibreRef.current;
  if (maplibreInstance) {
    maplibreInstance.removeLayer(layerConfig.id);
    maplibreInstance.removeSource(layerConfig.id);
    addNewLayer(layerConfig, maplibreRef);
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
    // Convert zoomRange to number[] to avoid type error for backport versions
    const zoomRange: number[] = applyZoomRangeToLayer(layerConfig);
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
      minzoom: zoomRange[0],
      maxzoom: zoomRange[1],
    });
  }
};

const getCustomMapURL = (layerConfig: CustomLayerSpecification) => {
  const layerSource = layerConfig?.source;
  if (layerSource?.customType === 'tms') {
    return layerSource?.url;
  } else if (layerSource?.customType === 'wms') {
    const referenceSystemName = layerSource.version === '1.3.0' ? 'crs' : 'srs';
    if (!layerSource.crs) {
      layerSource.crs = "EPSG:3857"
    }
    return `${layerSource?.url}?service=WMS&version=${layerSource.version}&request=GetMap&format=${layerSource.format}&transparent=true&layers=${layerSource?.layers}&styles=${layerSource.styles}&${referenceSystemName}=${layerSource.crs}&width=256&height=256&bbox={bbox-epsg-3857}`;
  } else {
    return '';
  }
};

export const applyZoomRangeToLayer = (layerConfig: CustomLayerSpecification) => {
  // Convert zoomRange to number[] to avoid type error for backport versions
  return layerConfig.zoomRange.map((zoom) => Number(zoom));
};

export const CustomLayerFunctions = {
  render: (maplibreRef: MaplibreRef, layerConfig: CustomLayerSpecification) => {
    return hasLayer(maplibreRef.current!, layerConfig.id)
      ? refreshLayer(layerConfig, maplibreRef)
      : addNewLayer(layerConfig, maplibreRef);
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: OSMLayerSpecification) => {
    removeLayers(maplibreRef.current!, layerConfig.id, true);
  },
};
