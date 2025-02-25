import {
  baseLayerTypeLookup,
  getBaseLayers,
  getDataLayers,
  getMaplibreAboveLayerId,
  layersFunctionMap,
  layersTypeIconMap,
  layersTypeNameMap,
} from './layersFunctions';
import { MapLayerSpecification } from './mapLayerType';
import { OSMLayerFunctions } from './OSMLayerFunctions';
import { DocumentLayerFunctions } from './documentLayerFunctions';
import { ClusterLayerFunctions } from './clusterLayerFunctions';
import { CustomLayerFunctions } from './customLayerFunctions';
import { MockMaplibreMap } from './map/__mocks__/map';
import { MockLayer } from './map/__mocks__/layer';
import { Map as Maplibre } from 'maplibre-gl';

describe('getDataLayers', () => {
  it('should return an array of DataLayerSpecification objects', () => {
    const layers = [
      { type: 'opensearch_vector_tile_map', name: 'layer1' },
      { type: 'custom_map', name: 'layer2' },
      { type: 'documents', name: 'layer3' },
      { type: 'opensearch_vector_tile_map', name: 'layer4' },
      { type: 'custom_map', name: 'layer5' },
    ] as unknown as MapLayerSpecification[];
    const dataLayers = getDataLayers(layers);
    expect(dataLayers).toHaveLength(1);
    expect(dataLayers[0].name).toBe('layer3');
  });
});

describe('getBaseLayers', () => {
  it('should return an array of BaseLayerSpecification objects', () => {
    const layers = [
      { type: 'opensearch_vector_tile_map', name: 'layer1' },
      { type: 'custom_map', name: 'layer2' },
      { type: 'documents', name: 'layer3' },
      { type: 'opensearch_vector_tile_map', name: 'layer4' },
      { type: 'custom_map', name: 'layer5' },
    ] as unknown as MapLayerSpecification[];
    const baseLayers = getBaseLayers(layers);
    expect(baseLayers).toHaveLength(4);
    expect(baseLayers[0].name).toBe('layer1');
    expect(baseLayers[1].name).toBe('layer2');
    expect(baseLayers[2].name).toBe('layer4');
    expect(baseLayers[3].name).toBe('layer5');
  });
});

describe('Exported objects', () => {
  it('should have the correct values assigned to their keys', () => {
    expect(layersFunctionMap).toEqual({
      opensearch_vector_tile_map: OSMLayerFunctions,
      documents: DocumentLayerFunctions,
      custom_map: CustomLayerFunctions,
      cluster: ClusterLayerFunctions,
    });

    expect(layersTypeNameMap).toEqual({
      opensearch_vector_tile_map: 'OpenSearch map',
      documents: 'Documents',
      custom_map: 'Custom map',
      cluster: 'Cluster',
    });

    expect(layersTypeIconMap).toEqual({
      opensearch_vector_tile_map: 'globe',
      documents: 'document',
      custom_map: 'globe',
      cluster: 'heatmap',
    });

    expect(baseLayerTypeLookup).toEqual({
      opensearch_vector_tile_map: true,
      custom_map: true,
      documents: false,
      cluster: false,
    });
  });
});

describe('getMaplibreAboveLayerId', () => {
  const mockMapLayer1Id = 'layer-1';
  const mockMapLayer2Id = 'layer-2';
  const mockMbLayer1: MockLayer = new MockLayer(`${mockMapLayer1Id}-1`);
  const mockMbLayer2: MockLayer = new MockLayer(`${mockMapLayer1Id}-2`);
  const mockMbLayer3: MockLayer = new MockLayer(`${mockMapLayer2Id}-1`);
  const mockMap = new MockMaplibreMap([
    mockMbLayer1,
    mockMbLayer2,
    mockMbLayer3,
  ]) as unknown as Maplibre;

  it('should return the id of the layer above the given mapLayerId', () => {
    const aboveLayerId = getMaplibreAboveLayerId(mockMapLayer1Id, mockMap);
    expect(aboveLayerId).toBe(`${mockMapLayer2Id}-1`);
  });

  it('should return undefined if there is no layer above the given mapLayerId', () => {
    const aboveLayerId = getMaplibreAboveLayerId(mockMapLayer2Id, mockMap);
    expect(aboveLayerId).toBeUndefined();
  });

  it('should return undefined if the given mapLayerId is not found', () => {
    const aboveLayerId = getMaplibreAboveLayerId('undefined-layer', mockMap);
    expect(aboveLayerId).toBeUndefined();
  });
});
