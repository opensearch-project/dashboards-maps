/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const geoJSONTypes: string[] = [
  'point',
  'linestring',
  'polygon',
  'multipoint',
  'multilinestring',
  'multipolygon',
  'geometrycollection',
];

export function isGeoJSON(value: { type: any; coordinates: any }) {
  if (!value) return false;
  if (!value.type || !value.coordinates) {
    return false;
  }
  const geoJSONType = value.type;
  if (geoJSONTypes.includes(geoJSONType.toLowerCase())) {
    return true;
  }
  return false;
}

function buildGeoJSONOfTypePoint(lon: number, lat: number) {
  return {
    type: 'Point',
    coordinates: [lon, lat],
  };
}

export function convertGeoPointToGeoJSON(location: any) {
  // An object with 'lat' and 'lon' properties
  if (location?.lat && location?.lon) {
    return buildGeoJSONOfTypePoint(location?.lon, location?.lat);
  }
  // Geopoint as an array && support either (lon/lat) or (lon/lat/z)
  if (Array.isArray(location) && (location.length === 2 || location.length === 3)) {
    return buildGeoJSONOfTypePoint(location[0], location[1]);
  }

  if (typeof location !== 'string') {
    return undefined;
  }
  // Geopoint as a string && support either (lat,lon) or (lat, lon, z)
  const values = location.trim().split(',');
  if (values && (values.length === 2 || values.length === 3)) {
    return buildGeoJSONOfTypePoint(parseFloat(values[1].trim()), parseFloat(values[0].trim()));
  }
  // TODO Geopoint as geohash & WKT Format
  return undefined;
}
