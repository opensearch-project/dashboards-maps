/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { cellToLatLng } from 'h3-js';

/**
 * Decodes geohash to object containing
 * top-left and bottom-right corners of
 * rectangle and center point.
 */
export function decodeGeoHash(geohash: string): number[] {
  const BITS: number[] = [16, 8, 4, 2, 1];
  const BASE32: string = '0123456789bcdefghjkmnpqrstuvwxyz';
  let isEven: boolean = true;
  const lat: number[] = [];
  const lon: number[] = [];
  lat[0] = -90.0;
  lat[1] = 90.0;
  lon[0] = -180.0;
  lon[1] = 180.0;
  let latErr: number = 90.0;
  let lonErr: number = 180.0;
  [...geohash].forEach((nextChar: string) => {
    const cd: number = BASE32.indexOf(nextChar);
    for (let j = 0; j < 5; j++) {
      const mask: number = BITS[j];
      if (isEven) {
        lonErr = lonErr /= 2;
        refineInterval(lon, cd, mask);
      } else {
        latErr = latErr /= 2;
        refineInterval(lat, cd, mask);
      }
      isEven = !isEven;
    }
  });
  lat[2] = (lat[0] + lat[1]) / 2;
  lon[2] = (lon[0] + lon[1]) / 2;
  const pointCoordinates = [lon[2], lat[2]];
  return pointCoordinates;
}

function refineInterval(interval: number[], cd: number, mask: number) {
  if (cd & mask) {
    interval[0] = (interval[0] + interval[1]) / 2;
  } else {
    interval[1] = (interval[0] + interval[1]) / 2;
  }
}

export function geohashColumns(precision: number): number {
  return geohashCells(precision, 0);
}

/**
 * Get the number of geohash cells for a given precision
 *
 * @param {number} precision the geohash precision (1<=precision<=12).
 * @param {number} axis constant for the axis 0=lengthwise (ie. columns, along longitude), 1=heightwise (ie. rows, along latitude).
 * @returns {number} Number of geohash cells (rows or columns) at that precision
 */
function geohashCells(precision: number, axis: number) {
  let cells = 1;
  for (let i = 1; i <= precision; i += 1) {
    /* On odd precisions, rows divide by 4 and columns by 8. Vice-versa on even precisions */
    cells *= i % 2 === axis ? 4 : 8;
  }
  return cells;
}

function tile2long(x: number, z: number) {
  return (x / Math.pow(2, z)) * 360 - 180;
}
function tile2lat(y: number, z: number) {
  var n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}
export const decodeGeoTile = (key: string) => {
  const keyArr = key.split('/');
  const z = keyArr[0],
    x = keyArr[1],
    y = keyArr[2];
  const lon = tile2long(Number(x), Number(z)),
    lat = tile2lat(Number(y), Number(z));
  return {
    lat: lat,
    lon: lon,
    z: z,
  };
};

export const decodeGeoHex = (h3Index: string) => {
  const [lat, lon] = cellToLatLng(h3Index);
  return {
    lat,
    lon,
  };
};

const EARTH_CIR_METERS = 40075016.686;
const degreesPerMeter = 360 / EARTH_CIR_METERS;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function latLngToBoundsToRadius(
  lat: number,
  lng: number,
  zoom: number,
  width: number,
  height: number
) {
  // width and height must correspond to the iframe width/height
  const metersPerPixelEW = EARTH_CIR_METERS / Math.pow(2, zoom + 8);
  const metersPerPixelNS = (EARTH_CIR_METERS / Math.pow(2, zoom + 8)) * Math.cos(toRadians(lat));

  const shiftMetersEW = (width / 2) * metersPerPixelEW;
  const shiftMetersNS = (height / 2) * metersPerPixelNS;

  const shiftDegreesEW = shiftMetersEW * degreesPerMeter;
  const shiftDegreesNS = shiftMetersNS * degreesPerMeter;
  return (shiftDegreesEW + shiftDegreesNS) / 2;
}

export function metersToPixel(zoom: number, meters: number) {
  // width and height must correspond to the iframe width/height
  const metersPerPixelEW = EARTH_CIR_METERS / Math.pow(2, zoom + 8);
  return meters / metersPerPixelEW;
}
