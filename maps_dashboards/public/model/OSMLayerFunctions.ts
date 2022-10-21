import { Map as Maplibre, LayerSpecification } from 'maplibre-gl';
import { ILayerConfig } from './ILayerConfig';
import { MAP_VECTOR_TILE_BASIC_STYLE } from '../../common';

interface MaplibreRef {
  current: Maplibre | null;
}

// Functions for OpenSearch maps vector tile layer
export const OSMLayerFunctions = {
  initial: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const renderStyleData = async () => {
        try {
          const response = await fetch(MAP_VECTOR_TILE_BASIC_STYLE);
          const json = await response.json();
          const styleLayers: LayerSpecification[] = await json.layers;
          styleLayers.forEach((styleLayer) => {
            styleLayer.id = styleLayer.id + '_' + layerConfig.id;
            // @ts-ignore
            maplibreRef.current.addLayer(styleLayer);
          });
        } catch (error) {
          console.log('error', error);
        }
      };
      renderStyleData();

      // @ts-ignore
      setTimeout(function () {
        const mbLayerJson: LayerSpecification[] = maplibreRef.current.getStyle().layers;
        mbLayerJson.map((mbLayer) => {
          if (mbLayer.id.includes(layerConfig.id)) {
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
      }, 50);
    }
  },
  update: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const mbLayerJson = maplibreInstance.getStyle().layers;
      mbLayerJson.forEach((mbLayer: { id: any; type: string }) => {
        if (mbLayer.id.includes(layerConfig.id)) {
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
  addNewLayer: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const renderStyleData = async () => {
        try {
          const response = await fetch(MAP_VECTOR_TILE_BASIC_STYLE);
          const json = await response.json();
          const styleLayers: LayerSpecification[] = await json.layers;
          styleLayers.forEach((styleLayer) => {
            styleLayer.id = styleLayer.id + '_' + layerConfig.id;
            // @ts-ignore
            maplibreRef.current.addLayer(styleLayer);
          });
        } catch (error) {
          console.log('error', error);
        }
      };
      renderStyleData();
    }
  },
  remove: (maplibreRef: MaplibreRef, layerConfig: ILayerConfig) => {
    const maplibreInstance = maplibreRef.current;
    if (maplibreInstance) {
      const mbLayerJson = maplibreInstance.getStyle().layers;
      if (mbLayerJson) {
        mbLayerJson.forEach((mbLayer: { id: any }) => {
          if (mbLayer.id.includes(layerConfig.id)) {
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
          if (mbLayer.id.includes(layerConfig.id)) {
            maplibreInstance.setLayoutProperty(mbLayer.id, 'visibility', layerConfig.visibility);
          }
        });
      }
    }
  },
};
