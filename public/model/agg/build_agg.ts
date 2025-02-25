/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { ClusterLayerSpecification } from '../mapLayerType';
import { getZoomPrecision } from '../../utils/precision';
import { MAP_DEFAULT_MAX_ZOOM, MAP_DEFAULT_MIN_ZOOM } from '../../../common';

function parseJson(jsonStr: string) {
  let json = {};
  try {
    json = JSON.parse(jsonStr);
  } catch (e) {}
  return json;
}

export const buildAgg = (source: ClusterLayerSpecification['source'], zoom: number) => {
  //regular body:
  // 2: {
  //  aggs: {
  //   1:{},
  //   3: {},
  //   },
  // },
  let agg: Record<'2', Record<string, string | number | Record<string, string | number> | any>> = {
    2: {},
  };

  function generateAggObjectIfEmpty() {
    if (!agg[2].aggs) {
      agg[2].aggs = {};
    }
  }

  const metricAgg = source.metric,
    clusterAgg = source.cluster;
  if (metricAgg.agg !== 'count') {
    generateAggObjectIfEmpty();
    let obj = {
      [metricAgg.agg]: { field: metricAgg.field },
    };
    if (metricAgg.json) {
      const json = parseJson(metricAgg.json);
      obj = { ...obj, ...json };
    }

    agg[2].aggs[1] = obj;
  }

  if (clusterAgg.useCentroid) {
    generateAggObjectIfEmpty();
    agg[2].aggs[3] = {
      geo_centroid: { field: clusterAgg.field },
    };
  }

  let clusterAggObj: Record<string, string | number> = {
    field: clusterAgg.field,
  };
  if (clusterAgg.json) {
    const json = parseJson(clusterAgg.json);
    clusterAggObj = { ...clusterAggObj, ...json };
  }
  if (!clusterAgg.changePrecision) {
    clusterAggObj.precision = Number(source.cluster.precision);
  } else {
    //zoom in maplibre is float, parse it to int
    let integerZoom = Math.trunc(zoom);

    //limit zoom in range
    integerZoom < MAP_DEFAULT_MIN_ZOOM && (integerZoom = MAP_DEFAULT_MIN_ZOOM);
    integerZoom > MAP_DEFAULT_MAX_ZOOM && (integerZoom = MAP_DEFAULT_MAX_ZOOM);

    const zoomPrecision = getZoomPrecision(integerZoom, source.cluster.agg);

    clusterAggObj.precision = zoomPrecision;
  }

  agg[2][clusterAgg.agg] = clusterAggObj;

  return agg;
};
