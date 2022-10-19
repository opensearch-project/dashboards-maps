import { Map as Maplibre } from 'maplibre-gl';
import { ILayerConfig } from './ILayerConfig';

interface MaplibreRef {
  current: Maplibre | null;
}

// Functions for OpenSearch maps vector tile layer
export const OSMLayerFunctions = {
  initial: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current
    if (maplibreInstance) {
      const mbLayerJson = maplibreInstance.getStyle().layers;
        mbLayerJson.map((mbLayer: { id: string }) => {
          if (mbLayer.id.includes(layerConfig.id) || layerConfig.id.includes('initial')) {
            maplibreInstance.setLayerZoomRange(
              mbLayer.id,
              layerConfig.zoomRange[0],
              layerConfig.zoomRange[1]
            );
            // TODO: figure out error reason
            if (mbLayer.type === 'symbol') {
              return;
            }
            maplibreInstance.setPaintProperty(
              mbLayer.id,
              `${mbLayer.type}-opacity`,
              layerConfig.opacity
            );
          }
      });
    }
  },
  update: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const mbLayerJson = maplibreInstance.getStyle().layers;
      mbLayerJson.forEach((mbLayer: { id: any; type: string }) => {
        if (mbLayer.id.includes(layerConfig.id) || layerConfig.id.includes('initial')) {
          maplibreInstance.setLayerZoomRange(
            mbLayer.id,
            layerConfig.zoomRange[0],
            layerConfig.zoomRange[1]
          );
          if (mbLayer.type === 'symbol') {
            return;
          }
          maplibreInstance.setPaintProperty(
            mbLayer.id,
            `${mbLayer.type}-opacity`,
            layerConfig.opacity
          );
        }
      });
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const mbLayerJson = maplibreInstance.getStyle().layers;
      if (mbLayerJson) {
        mbLayerJson.forEach((mbLayer: { id: any }) => {
          if (mbLayer.id.includes(layerConfig.id) || layerConfig.id.includes('initial')) {
            maplibreInstance.removeLayer(mbLayer.id);
          }
        });
      }
    }
  },
  hide: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const mbLayerJson = maplibreInstance.getStyle().layers;
      if (mbLayerJson) {
        mbLayerJson.forEach((mbLayer: { id: any }) => {
          if (mbLayer.id.includes(layerConfig.id) || layerConfig.id.includes('initial')) {
            maplibreInstance.setLayoutProperty(mbLayer.id, 'visibility', layerConfig.visibility);
          }
        });
      }
    }
  },
};
