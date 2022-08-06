/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpenSearchDashboardsMapLayer, ORIGIN } from "../../..";
import {
    createRegionBlockedWarning,
    removeRegionBlockedWarning
} from '../../map_messages';

const WMS_MINZOOM = 0;
const WMS_MAXZOOM = 22; //increase this to 22. Better for WMS

/**
 * Construct WMSLayer
 */
export class WMSLayer extends OpenSearchDashboardsMapLayer {
    _leaflet;
    _isDesaturated;

    constructor(
        options: any,
        opensearchDashboardsMap: any,
        leaflet: any
    ) {
        super(opensearchDashboardsMap, options);
        this._leaflet = leaflet;
        this._isDesaturated = options.isDesaturated;
        this._leafletLayer = null;
    }

    /**
     * Create a new WmsLayer
     * @returns leafletLayer
     */
    async createLeafletLayer() {
        if (WMS_MINZOOM > this._opensearchDashboardsMap.getMaxZoomLevel()) {
            this._opensearchDashboardsMap.setMinZoom(WMS_MINZOOM);
            this._opensearchDashboardsMap.setMaxZoom(WMS_MAXZOOM);
        }
        const wmsOptions = {
            format: this._options.typeOptions.format || '',
            layers: this._options.typeOptions.layers || '',
            minZoom: this._options.minZoom,
            maxZoom: this._options.maxZoom,
            styles: this._options.typeOptions.styles || '',
            transparent: this._options.typeOptions.transparent,
            version: this._options.typeOptions.version || '1.3.0',
            crossOrigin: true
        };

        let leafletLayer = this._leaflet.tileLayer.wms(this._options.typeOptions.url, wmsOptions);

        if (leafletLayer) {
            leafletLayer.on("tileload", () => this._updateDesaturation());
            leafletLayer.on('tileerror', () => {
                if (this._options.showRegionBlcokedWarning) {
                    createRegionBlockedWarning();
                }
            });

            if (this._options.showZoomMessage) {
                leafletLayer.on('add', () => {
                    this._opensearchDashboardsMap._addMaxZoomMessage(leafletLayer)
                });
            }
        }
        return leafletLayer;
    }

    _updateDesaturation() {
        removeRegionBlockedWarning();
        const tiles = $('img.leaflet-tile-loaded');
        if (this._isDesaturated) {
            tiles.removeClass('filters-off');
        }
        else {
            tiles.addClass('filters-off');
        }
    }

    setDesaturate(isDesaturated: boolean) {
        if (isDesaturated === this._isDesaturated) {
            return;
        }
        this._isDesaturated = isDesaturated;
        this._updateDesaturation();
        if (this._leafletLayer) {
            this._leafletLayer.redraw();
        }
    }

    /**
     * Depedning on the passing in options, 
     * whether updateOptions or recreate new layer
     * @param option 
     * @returns 
     */
    isReusable(option: any): boolean {
        return super.isReusable(option) && JSON.stringify(this._options.typeOptions) === JSON.stringify(option.typeOptions);
    }
}
