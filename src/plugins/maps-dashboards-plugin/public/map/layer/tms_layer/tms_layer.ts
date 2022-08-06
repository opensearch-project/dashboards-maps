/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayerOptions, OpenSearchDashboardsMapLayer } from "../../..";
import {
    createRegionBlockedWarning,
    removeRegionBlockedWarning
} from '../../map_messages';
import { getEmsTileLayerId, getToasts, getUiSettings } from "../../../maps_explorer_dashboards_services";
import { getServiceSettings } from "../../../get_service_settings";

/**
 * Construct TmsLayer
 */
export class TMSLayer extends OpenSearchDashboardsMapLayer {
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

    async decorateOptions(options: LayerOptions) {
        const emsTileLayerId = getEmsTileLayerId();

        try {
            const serviceSettings = await getServiceSettings();
            const tmsServices = await serviceSettings.getTMSServices();
            const userConfiguredTmsLayer = tmsServices[0];
            const initMapLayer = userConfiguredTmsLayer
                ? userConfiguredTmsLayer
                : tmsServices.find((s) => s.id === emsTileLayerId.bright);
            if (initMapLayer) {
                this._opensearchDashboardsMap.setMinZoom(initMapLayer.minZoom);
                this._opensearchDashboardsMap.setMaxZoom(initMapLayer.maxZoom);
                if (this._opensearchDashboardsMap.getZoomLevel() > initMapLayer.maxZoom) {
                    this._opensearchDashboardsMap.setZoomLevel(initMapLayer.maxZoom);
                }
                let isDesaturated = this._options.isDesaturated;
                if (typeof isDesaturated !== 'boolean') {
                    isDesaturated = false;
                }
                const isDarkMode = getUiSettings().get('theme:darkMode');
                const serviceSettings = await getServiceSettings();
                const meta = await serviceSettings.getAttributesForTMSLayer(
                    initMapLayer,
                    isDesaturated,
                    isDarkMode
                );
                const showZoomMessage = serviceSettings.shouldShowZoomMessage(initMapLayer);
                delete initMapLayer.subdomains;
                delete initMapLayer.id;
                const newOptions = { ...initMapLayer, showZoomMessage, ...meta, ...options };
                return newOptions;
            }
        } catch (e: any) {
            getToasts().addWarning(e.message);
            return;
        }
        return;
    }

    /**
     * Create a new tmsLayer
     * @returns leafletLayer
     */
    async createLeafletLayer() {
        let leafletLayer = this._leaflet.tileLayer(this._options.url, {
            minZoom: this._options.minZoom,
            maxZoom: this._options.maxZoom,
            subdomains: this._options.subdomains || [],
            crossOrigin: true
        });

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
}
