/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Feature, GeoJSON, Position } from 'geojson';
import { DrawCustomMode, DrawFeature, DrawPolygon, MapMouseEvent } from '@mapbox/mapbox-gl-draw';
import {isEscapeKey} from "../../../../common/util";

// converted to typescript from
// https://github.com/mapbox/geojson.io/blob/main/src/ui/draw/rectangle.js
const doubleClickZoom = {
  enable: (ctx: any) => {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (
        !ctx.map ||
        !ctx.map.doubleClickZoom ||
        !ctx._ctx ||
        !ctx._ctx.store ||
        !ctx._ctx.store.getInitialConfigValue
      )
        return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
  disable(ctx: { map: { doubleClickZoom: { disable: () => void } } }) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.doubleClickZoom.disable();
    }, 0);
  },
};

interface DrawRectangleState extends DrawPolygon {
  startPoint: Position;
  endPoint: Position;
}

// TODO Convert this to class
export const DrawRectangle: DrawCustomMode<DrawRectangleState, {}> = {
  onSetup(): any {
    const rectangleGeoJSON: GeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
    };
    const rectangle: DrawFeature = this.newFeature(rectangleGeoJSON);
    // @ts-ignore
    this.addFeature(rectangle);
    // @ts-ignore
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    // @ts-ignore
    this.updateUIClasses({ mouse: 'add' });
    // @ts-ignore
    this.setActionableState({
      trash: true,
    });
    return rectangle;
  },
  // Whenever a user clicks on the map, Draw will call `onClick`
  onClick(state: DrawRectangleState, e: MapMouseEvent) {
    // if state.startPoint exist, means its second click
    // change to  simple_select mode
    if (
      state.startPoint &&
      state.startPoint[0] !== e.lngLat.lng &&
      state.startPoint[1] !== e.lngLat.lat
    ) {
      // @ts-ignore
      this.updateUIClasses({ mouse: 'pointer' });
      state.endPoint = [e.lngLat.lng, e.lngLat.lat];
      // @ts-ignore
      this.changeMode('simple_select', { featuresId: state.id });
    }
    // on first click, save clicked point coords as starting for  rectangle
    const startPoint = [e.lngLat.lng, e.lngLat.lat];
    state.startPoint = startPoint;
  },
  onMouseMove(state: DrawRectangleState, e: MapMouseEvent) {
    // if startPoint, update the feature coordinates, using the bounding box concept
    // we are simply using the startingPoint coordinates and the current Mouse Position
    // coordinates to calculate the bounding box on the fly, which will be our rectangle
    if (state.startPoint) {
      state.updateCoordinate('0.0', state.startPoint[0], state.startPoint[1]); // minX, minY - the starting point
      state.updateCoordinate('0.1', e.lngLat.lng, state.startPoint[1]); // maxX, minY
      state.updateCoordinate('0.2', e.lngLat.lng, e.lngLat.lat); // maxX, maxY
      state.updateCoordinate('0.3', state.startPoint[0], e.lngLat.lat); // minX,maxY
      state.updateCoordinate('0.4', state.startPoint[0], state.startPoint[1]); // minX,minY - ending point (equals to starting point)
    }
  },
  onKeyUp(state: DrawRectangleState, e: KeyboardEvent) {
    if (isEscapeKey(e)) {
      // delete feature on Escape, else, onStop will append feature and fires draw.create event
      // @ts-ignore
      this.deleteFeature([state.id], { silent: true });
      // change mode to simple select if escape is pressed
      // @ts-ignore
      this.changeMode('simple_select');
    }
  },
  onStop(state: DrawRectangleState) {
    doubleClickZoom.enable(this);
    // @ts-ignore
    this.updateUIClasses({ mouse: 'none' });
    // @ts-ignore
    this.activateUIButton();

    // check to see if we've deleted this feature
    // @ts-ignore
    if (this.getFeature(state.id) === undefined) return;

    // remove last added coordinate
    state.removeCoordinate('0.4');
    if (state.isValid()) {
      // @ts-ignore
      this.map.fire('draw.create', {
        features: [state.toGeoJSON()],
      });
    } else {
      // @ts-ignore
      this.deleteFeature([state.id], { silent: true });
      // @ts-ignore
      this.changeMode('simple_select', {}, { silent: true });
    }
  },
  toDisplayFeatures(
    state: DrawRectangleState,
    geojson: Feature,
    display: (geojson: Feature) => void
  ) {
    const isActivePolygon = geojson?.properties?.id === state.id;
    geojson.properties!.active = isActivePolygon ? 'true' : 'false';
    if (!isActivePolygon) return display(geojson);

    // Only render the rectangular polygon if it has the starting point
    if (!state.startPoint) return;
    return display(geojson);
  },
  onTrash(state: DrawRectangleState) {
    // @ts-ignore
    this.deleteFeature([state.id], { silent: true });
    // @ts-ignore
    this.changeMode('simple_select');
  },
};
