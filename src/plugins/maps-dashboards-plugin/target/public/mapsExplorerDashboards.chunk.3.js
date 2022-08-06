(window["mapsExplorerDashboards_bundle_jsonpfunction"] = window["mapsExplorerDashboards_bundle_jsonpfunction"] || []).push([[3],{

/***/ "./public/common/opensearch_maps_client.js":
/*!*************************************************!*\
  !*** ./public/common/opensearch_maps_client.js ***!
  \*************************************************/
/*! exports provided: OpenSearchMapsClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OpenSearchMapsClient", function() { return OpenSearchMapsClient; });
/* harmony import */ var _elastic_ems_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/ems-client */ "../../node_modules/@elastic/ems-client/target/web/index.js");
/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

class OpenSearchMapsClient extends _elastic_ems_client__WEBPACK_IMPORTED_MODULE_0__["EMSClient"] {
  constructor(_ref) {
    let {
      osdVersion,
      manifestServiceUrl,
      language,
      landingPageUrl,
      fetchFunction
    } = _ref;
    super({
      osdVersion,
      manifestServiceUrl,
      language,
      landingPageUrl,
      fetchFunction
    });
    this._queryParams = {
      osd_version: osdVersion,
      opensearch_tos_agree: true
    };
    this._manifestServiceUrl = manifestServiceUrl;
  }

  async isEnabled() {
    let result;

    try {
      result = await this._fetchWithTimeout(this._manifestServiceUrl);
    } catch (e) {
      // silently ignoring the exception and returning false.
      return false;
    }

    if (result.ok) {
      const resultJson = await result.json();
      return resultJson.enabled;
    }

    return false;
  }

}

/***/ }),

/***/ "./public/lazy_load_bundle/lazy/index.ts":
/*!***********************************************!*\
  !*** ./public/lazy_load_bundle/lazy/index.ts ***!
  \***********************************************/
/*! exports provided: OpenSearchDashboardsMap, ServiceSettings, L */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _map_opensearch_dashboards_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../map/opensearch_dashboards_map */ "./public/map/opensearch_dashboards_map.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OpenSearchDashboardsMap", function() { return _map_opensearch_dashboards_map__WEBPACK_IMPORTED_MODULE_0__["OpenSearchDashboardsMap"]; });

/* harmony import */ var _map_service_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../map/service_settings */ "./public/map/service_settings.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ServiceSettings", function() { return _map_service_settings__WEBPACK_IMPORTED_MODULE_1__["ServiceSettings"]; });

/* harmony import */ var _leaflet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../leaflet */ "./public/leaflet.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "L", function() { return _leaflet__WEBPACK_IMPORTED_MODULE_2__["L"]; });

/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */
// @ts-expect-error
 // @ts-expect-error

 // @ts-expect-error



/***/ }),

/***/ "./public/leaflet.js":
/*!***************************!*\
  !*** ./public/leaflet.js ***!
  \***************************/
/*! exports provided: L */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "L", function() { return L; });
/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */
if (!window.hasOwnProperty('L')) {
  __webpack_require__(/*! leaflet/dist/leaflet.css */ "../../node_modules/leaflet/dist/leaflet.css");

  window.L = __webpack_require__(/*! leaflet/dist/leaflet.js */ "../../node_modules/leaflet/dist/leaflet.js");
  window.L.Browser.touch = false;
  window.L.Browser.pointer = false;

  __webpack_require__(/*! leaflet-vega */ "../../node_modules/leaflet-vega/dist/bundle.js");

  __webpack_require__(/*! leaflet.heat/dist/leaflet-heat.js */ "../../node_modules/leaflet.heat/dist/leaflet-heat.js");

  __webpack_require__(/*! leaflet-draw/dist/leaflet.draw.css */ "../../node_modules/leaflet-draw/dist/leaflet.draw.css");

  __webpack_require__(/*! leaflet-draw/dist/leaflet.draw.js */ "../../node_modules/leaflet-draw/dist/leaflet.draw.js");

  __webpack_require__(/*! leaflet-responsive-popup/leaflet.responsive.popup.css */ "../../node_modules/leaflet-responsive-popup/leaflet.responsive.popup.css");

  __webpack_require__(/*! leaflet-responsive-popup/leaflet.responsive.popup.js */ "../../node_modules/leaflet-responsive-popup/leaflet.responsive.popup.js");
}

const L = window.L;

/***/ }),

/***/ "./public/map/map_messages.js":
/*!************************************!*\
  !*** ./public/map/map_messages.js ***!
  \************************************/
/*! exports provided: createRegionBlockedWarning, removeRegionBlockedWarning, createZoomWarningMsg */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRegionBlockedWarning", function() { return createRegionBlockedWarning; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeRegionBlockedWarning", function() { return removeRegionBlockedWarning; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createZoomWarningMsg", function() { return createZoomWarningMsg; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _osd_i18n_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @osd/i18n/react */ "@osd/i18n/react");
/* harmony import */ var _osd_i18n_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _src_plugins_opensearch_dashboards_react_public__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../src/plugins/opensearch_dashboards_react/public */ "plugin/opensearchDashboardsReact/public");
/* harmony import */ var _src_plugins_opensearch_dashboards_react_public__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_opensearch_dashboards_react_public__WEBPACK_IMPORTED_MODULE_4__);
/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/* eslint-disable react/no-multi-comp */





const createRegionBlockedWarning = function () {
  /* eslint-disable react/prefer-stateless-function */
  class RegionBlockedWarningOverlay extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiEmptyPrompt"], {
        iconType: "gisApp",
        iconColor: null,
        title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "The default Web Map Service is currently not available in your region."),
        titleSize: "xs",
        body: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "You can configure OpenSearch Dashboards to use a different map server for coordinate maps by modifying the default WMS properties."))
      });
    }

  }

  return () => {
    let messageBlock = document.getElementById('blocker-div');

    if (!messageBlock) {
      messageBlock = document.createElement('div');
      messageBlock.id = 'blocker-div';
      messageBlock.setAttribute('class', 'visError leaflet-popup-pane');
      Array.prototype.forEach.call(document.getElementsByClassName('leaflet-container'), leafletDom => {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(new RegionBlockedWarningOverlay().render(), leafletDom.appendChild(messageBlock));
      });
    }
  };
}();
const removeRegionBlockedWarning = function () {
  return () => {
    const childEle = document.getElementById('blocker-div');

    if (childEle) {
      childEle.parentNode.removeChild(childEle);
    }
  };
}();
const createZoomWarningMsg = function () {
  let disableZoomMsg = false;

  const setZoomMsg = boolDisableMsg => disableZoomMsg = boolDisableMsg;

  class ZoomWarning extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
    constructor(props) {
      super(props);
      this.state = {
        disabled: false
      };
    }

    render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_osd_i18n_react__WEBPACK_IMPORTED_MODULE_2__["FormattedMessage"], {
        id: "maps_legacy.opensearchDashboardsMap.zoomWarning",
        defaultMessage: "You've reached the maximum number of zoom levels. To zoom all the way in, you can configure your own map server. Please go to { wms } for more information.",
        values: {
          wms: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            target: "_blank",
            href: "https://opensearch.org/docs/latest/dashboards/maptiles/"
          }, `Custom WMS Configuration`)
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSpacer"], {
        size: "xs"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiButtonEmpty"], {
        size: "s",
        flush: "left",
        isDisabled: this.state.disabled,
        onClick: () => {
          this.setState({
            disabled: true
          }, () => this.props.onChange(this.state.disabled));
        },
        "data-test-subj": "suppressZoomWarnings"
      }, `Don't show again`));
    }

  }

  const zoomToast = {
    title: 'No additional zoom levels',
    text: Object(_src_plugins_opensearch_dashboards_react_public__WEBPACK_IMPORTED_MODULE_4__["toMountPoint"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ZoomWarning, {
      onChange: setZoomMsg
    })),
    'data-test-subj': 'maxZoomWarning'
  };
  return (toastService, getZoomLevel, getMaxZoomLevel) => {
    return () => {
      const zoomLevel = getZoomLevel();
      const maxMapZoom = getMaxZoomLevel();

      if (!disableZoomMsg && zoomLevel === maxMapZoom) {
        toastService.addDanger(zoomToast);
      }
    };
  };
}();

/***/ }),

/***/ "./public/map/opensearch_dashboards_map.js":
/*!*************************************************!*\
  !*** ./public/map/opensearch_dashboards_map.js ***!
  \*************************************************/
/*! exports provided: OpenSearchDashboardsMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OpenSearchDashboardsMap", function() { return OpenSearchDashboardsMap; });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "../../node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _map_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map_messages */ "./public/map/map_messages.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _zoom_to_precision__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./zoom_to_precision */ "./public/map/zoom_to_precision.ts");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @osd/i18n */ "@osd/i18n");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../maps_explorer_dashboards_services */ "./public/maps_explorer_dashboards_services.ts");
/* harmony import */ var _leaflet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../leaflet */ "./public/leaflet.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */








function makeFitControl(fitContainer, opensearchDashboardsMap) {
  // eslint-disable-next-line no-undef
  const FitControl = _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].Control.extend({
    options: {
      position: 'topleft'
    },
    initialize: function (fitContainer, opensearchDashboardsMap) {
      this._fitContainer = fitContainer;
      this._opensearchDashboardsMap = opensearchDashboardsMap;
      this._leafletMap = null;
    },
    onAdd: function (leafletMap) {
      this._leafletMap = leafletMap;
      const fitDatBoundsLabel = _osd_i18n__WEBPACK_IMPORTED_MODULE_4__["i18n"].translate('maps_legacy.opensearchDashboardsMap.leaflet.fitDataBoundsAriaLabel', {
        defaultMessage: 'Fit Data Bounds'
      });
      jquery__WEBPACK_IMPORTED_MODULE_2___default()(this._fitContainer).html(`<a class="kuiIcon fa-crop" href="#" title="${fitDatBoundsLabel}" aria-label="${fitDatBoundsLabel}"></a>`).on('click', e => {
        e.preventDefault();

        this._opensearchDashboardsMap.fitToData();
      });
      return this._fitContainer;
    },
    onRemove: function () {
      jquery__WEBPACK_IMPORTED_MODULE_2___default()(this._fitContainer).off('click');
    }
  });
  return new FitControl(fitContainer, opensearchDashboardsMap);
}

function makeLegendControl(container, opensearchDashboardsMap, position) {
  // eslint-disable-next-line no-undef
  const LegendControl = _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].Control.extend({
    options: {
      position: 'topright'
    },
    initialize: function (container, opensearchDashboardsMap, position) {
      this._legendContainer = container;
      this._opensearchDashboardsMap = opensearchDashboardsMap;
      this.options.position = position;
    },

    updateContents() {
      this._legendContainer.empty();

      const $div = jquery__WEBPACK_IMPORTED_MODULE_2___default()('<div>').addClass('visMapLegend');

      this._legendContainer.append($div);

      const layers = this._opensearchDashboardsMap.getLayers();

      layers.forEach(layer => layer.appendLegendContents($div));
    },

    onAdd: function () {
      this._layerUpdateHandle = () => this.updateContents();

      this._opensearchDashboardsMap.on('layers:update', this._layerUpdateHandle);

      this.updateContents();
      return this._legendContainer.get(0);
    },
    onRemove: function () {
      this._opensearchDashboardsMap.removeListener('layers:update', this._layerUpdateHandle);

      this._legendContainer.empty();
    }
  });
  return new LegendControl(container, opensearchDashboardsMap, position);
}
/**
 * Collects map functionality required for OpenSearch Dashboards.
 * Serves as simple abstraction for leaflet as well.
 */


class OpenSearchDashboardsMap extends events__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"] {
  constructor(containerNode, options) {
    super();

    _defineProperty(this, "getZoomLevel", () => {
      return this._leafletMap.getZoom();
    });

    _defineProperty(this, "getMaxZoomLevel", () => {
      return this._leafletMap.getMaxZoom();
    });

    _defineProperty(this, "_addMaxZoomMessage", layer => {
      const zoomWarningMsg = Object(_map_messages__WEBPACK_IMPORTED_MODULE_1__["createZoomWarningMsg"])(Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_5__["getToasts"])(), this.getZoomLevel, this.getMaxZoomLevel);

      this._leafletMap.on('zoomend', zoomWarningMsg);

      this._containerNode.setAttribute('data-test-subj', 'zoomWarningEnabled');

      layer.on('remove', () => {
        this._leafletMap.off('zoomend', zoomWarningMsg);

        this._containerNode.removeAttribute('data-test-subj');
      });
    });

    this._containerNode = containerNode;
    this._leafletDrawControl = null;
    this._leafletFitControl = null;
    this._leafletLegendControl = null;
    this._legendPosition = 'bottomright';
    this._layers = [];
    this._listeners = [];
    this._showTooltip = false;
    const leafletOptions = {
      minZoom: options.minZoom,
      maxZoom: options.maxZoom,
      center: options.center ? options.center : [0, 0],
      zoom: options.zoom ? options.zoom : 2,
      // eslint-disable-next-line no-undef
      renderer: _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].canvas(),
      zoomAnimation: false,
      // Desaturate map tiles causes animation rendering artifacts
      zoomControl: options.zoomControl === undefined ? true : options.zoomControl
    }; // eslint-disable-next-line no-undef

    this._leafletMap = _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].map(containerNode, leafletOptions);

    this._leafletMap.attributionControl.setPrefix('');

    if (!options.scrollWheelZoom) {
      this._leafletMap.scrollWheelZoom.disable();
    }

    let previousZoom = this._leafletMap.getZoom();

    this._leafletMap.on('zoomend', () => {
      if (previousZoom !== this._leafletMap.getZoom()) {
        previousZoom = this._leafletMap.getZoom();
        this.emit('zoomchange');
      }
    });

    this._leafletMap.on('zoomend', () => this.emit('zoomend'));

    this._leafletMap.on('dragend', () => this.emit('dragend'));

    this._leafletMap.on('zoomend', () => this._updateExtent());

    this._leafletMap.on('dragend', () => this._updateExtent());

    this._leafletMap.on('mousemove', e => this._layers.forEach(layer => layer.movePointer('mousemove', e)));

    this._leafletMap.on('mouseout', e => this._layers.forEach(layer => layer.movePointer('mouseout', e)));

    this._leafletMap.on('mousedown', e => this._layers.forEach(layer => layer.movePointer('mousedown', e)));

    this._leafletMap.on('mouseup', e => this._layers.forEach(layer => layer.movePointer('mouseup', e)));

    this._leafletMap.on('draw:created', event => {
      const drawType = event.layerType;

      if (drawType === 'rectangle') {
        const bounds = event.layer.getBounds();
        const southEast = bounds.getSouthEast();
        const northWest = bounds.getNorthWest();
        let southEastLng = southEast.lng;

        if (southEastLng > 180) {
          southEastLng -= 360;
        }

        let northWestLng = northWest.lng;

        if (northWestLng < -180) {
          northWestLng += 360;
        }

        const southEastLat = southEast.lat;
        const northWestLat = northWest.lat; //Bounds cannot be created unless they form a box with larger than 0 dimensions
        //Invalid areas are rejected by OpenSearch.

        if (southEastLat === northWestLat || southEastLng === northWestLng) {
          return;
        }

        this.emit('drawCreated:rectangle', {
          bounds: {
            bottom_right: {
              lat: southEastLat,
              lon: southEastLng
            },
            top_left: {
              lat: northWestLat,
              lon: northWestLng
            }
          }
        });
      } else if (drawType === 'polygon') {
        const latLongs = event.layer.getLatLngs()[0];
        this.emit('drawCreated:polygon', {
          points: latLongs.map(leafletLatLng => {
            return {
              lat: leafletLatLng.lat,
              lon: leafletLatLng.lng
            };
          })
        });
      }
    });

    this.resize();
  }

  setShowTooltip(showTooltip) {
    this._showTooltip = showTooltip;
  }

  getLayers() {
    return this._layers.slice();
  }

  addLayer(opensearchDashboardsLayer) {
    const onshowTooltip = event => {
      if (!this._showTooltip) {
        return;
      }

      if (!this._popup) {
        // eslint-disable-next-line no-undef
        this._popup = new _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].ResponsivePopup({
          autoPan: false
        });

        this._popup.setLatLng(event.position);

        this._popup.setContent(event.content);

        this._leafletMap.openPopup(this._popup);
      } else {
        if (!this._popup.getLatLng().equals(event.position)) {
          this._popup.setLatLng(event.position);
        }

        if (this._popup.getContent() !== event.content) {
          this._popup.setContent(event.content);
        }
      }
    };

    opensearchDashboardsLayer.on('showTooltip', onshowTooltip);

    this._listeners.push({
      name: 'showTooltip',
      handle: onshowTooltip,
      layer: opensearchDashboardsLayer
    });

    const onHideTooltip = () => {
      this._leafletMap.closePopup();

      this._popup = null;
    };

    opensearchDashboardsLayer.on('hideTooltip', onHideTooltip);

    this._listeners.push({
      name: 'hideTooltip',
      handle: onHideTooltip,
      layer: opensearchDashboardsLayer
    });

    const onStyleChanged = () => {
      if (this._leafletLegendControl) {
        this._leafletLegendControl.updateContents();
      }
    };

    opensearchDashboardsLayer.on('styleChanged', onStyleChanged);

    this._listeners.push({
      name: 'styleChanged',
      handle: onStyleChanged,
      layer: opensearchDashboardsLayer
    });

    const onLayerUpdate = () => {
      this.emit('layers:update');
    };

    opensearchDashboardsLayer.on('layer:update', onLayerUpdate);

    this._listeners.push({
      name: 'layer:update',
      handle: onHideTooltip,
      layer: opensearchDashboardsLayer
    });

    this._layers.push(opensearchDashboardsLayer);

    opensearchDashboardsLayer.addToLeafletMap(this._leafletMap);
    this.emit('layers:update');

    this._addAttributions(opensearchDashboardsLayer.getAttributions());
  }

  removeLayer(opensearchDashboardsLayer) {
    if (!opensearchDashboardsLayer) {
      return;
    }

    this._removeAttributions(opensearchDashboardsLayer.getAttributions());

    const index = this._layers.indexOf(opensearchDashboardsLayer);

    if (index >= 0) {
      this._layers.splice(index, 1);

      opensearchDashboardsLayer.removeFromLeafletMap(this._leafletMap);
    }

    this._listeners.forEach(listener => {
      if (listener.layer === opensearchDashboardsLayer) {
        listener.layer.removeListener(listener.name, listener.handle);
      }
    }); //must re-add all attributions, because we might have removed dupes


    this._layers.forEach(layer => this._addAttributions(layer.getAttributions()));
  }

  _addAttributions(attribution) {
    const attributions = getAttributionArray(attribution);
    attributions.forEach(attribution => {
      this._leafletMap.attributionControl.removeAttribution(attribution); //this ensures we do not add duplicates


      this._leafletMap.attributionControl.addAttribution(attribution);
    });
  }

  _removeAttributions(attribution) {
    const attributions = getAttributionArray(attribution);
    attributions.forEach(attribution => {
      this._leafletMap.attributionControl.removeAttribution(attribution); //this ensures we do not add duplicates

    });
  }

  destroy() {
    if (this._leafletFitControl) {
      this._leafletMap.removeControl(this._leafletFitControl);
    }

    if (this._leafletDrawControl) {
      this._leafletMap.removeControl(this._leafletDrawControl);
    }

    if (this._leafletLegendControl) {
      this._leafletMap.removeControl(this._leafletLegendControl);
    }

    let layer;

    while (this._layers.length) {
      layer = this._layers.pop();
      layer.removeFromLeafletMap(this._leafletMap);
    }

    this._leafletMap.remove();

    this._containerNode.innerHTML = '';

    this._listeners.forEach(listener => listener.layer.removeListener(listener.name, listener.handle));
  }

  getCenter() {
    const center = this._leafletMap.getCenter();

    return {
      lon: center.lng,
      lat: center.lat
    };
  }

  setCenter(latitude, longitude) {
    // eslint-disable-next-line no-undef
    const latLong = _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].latLng(latitude, longitude);

    if (latLong.equals && !latLong.equals(this._leafletMap.getCenter())) {
      this._leafletMap.setView(latLong);
    }
  }

  setZoomLevel(zoomLevel) {
    if (this._leafletMap.getZoom() !== zoomLevel) {
      this._leafletMap.setZoom(zoomLevel);
    }
  }

  getGeohashPrecision() {
    return Object(_zoom_to_precision__WEBPACK_IMPORTED_MODULE_3__["zoomToPrecision"])(this._leafletMap.getZoom(), 12, this._leafletMap.getMaxZoom());
  }

  getLeafletBounds() {
    return this._leafletMap.getBounds();
  }

  getMetersPerPixel() {
    const pointC = this._leafletMap.latLngToContainerPoint(this._leafletMap.getCenter()); // center (pixels)


    const pointX = [pointC.x + 1, pointC.y]; // add one pixel to x

    const pointY = [pointC.x, pointC.y + 1]; // add one pixel to y

    const latLngC = this._leafletMap.containerPointToLatLng(pointC);

    const latLngX = this._leafletMap.containerPointToLatLng(pointX);

    const latLngY = this._leafletMap.containerPointToLatLng(pointY);

    const distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)

    const distanceY = latLngC.distanceTo(latLngY); // calculate distance between c and y (longitude)

    return Math.min(distanceX, distanceY);
  }

  _getLeafletBounds(resizeOnFail) {
    const boundsRaw = this._leafletMap.getBounds();

    const bounds = this._leafletMap.wrapLatLngBounds(boundsRaw);

    if (!bounds) {
      return null;
    }

    const southEast = bounds.getSouthEast();
    const northWest = bounds.getNorthWest();

    if (southEast.lng === northWest.lng || southEast.lat === northWest.lat) {
      if (resizeOnFail) {
        this._leafletMap.invalidateSize();

        return this._getLeafletBounds(false);
      } else {
        return null;
      }
    } else {
      return bounds;
    }
  }

  getBounds() {
    const bounds = this._getLeafletBounds(true);

    if (!bounds) {
      return null;
    }

    const southEast = bounds.getSouthEast();
    const northWest = bounds.getNorthWest();
    const southEastLng = southEast.lng;
    const northWestLng = northWest.lng;
    const southEastLat = southEast.lat;
    const northWestLat = northWest.lat; // When map has not width or height, the map has no dimensions.
    // These dimensions are enforced due to CSS style rules that enforce min-width/height of 0
    // that enforcement also resolves errors with the heatmap layer plugin.

    return {
      bottom_right: {
        lat: southEastLat,
        lon: southEastLng
      },
      top_left: {
        lat: northWestLat,
        lon: northWestLng
      }
    };
  }

  setDesaturate(isDesaturated) {
    this._layers.forEach(layer => layer.setDesaturate(isDesaturated));
  }

  addDrawControl() {
    const drawColor = '#000';
    const drawOptions = {
      draw: {
        polyline: false,
        marker: false,
        circle: false,
        rectangle: {
          shapeOptions: {
            stroke: false,
            color: drawColor
          }
        },
        polygon: {
          shapeOptions: {
            color: drawColor
          }
        },
        circlemarker: false
      }
    }; // eslint-disable-next-line no-undef

    this._leafletDrawControl = new _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].Control.Draw(drawOptions);

    this._leafletMap.addControl(this._leafletDrawControl);
  }

  addFitControl() {
    if (this._leafletFitControl || !this._leafletMap) {
      return;
    } // eslint-disable-next-line no-undef


    const fitContainer = _leaflet__WEBPACK_IMPORTED_MODULE_6__["L"].DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-fit');
    this._leafletFitControl = makeFitControl(fitContainer, this);

    this._leafletMap.addControl(this._leafletFitControl);
  }

  addLegendControl() {
    if (this._leafletLegendControl || !this._leafletMap) {
      return;
    }

    this._updateLegend();
  }

  setLegendPosition(position) {
    if (this._legendPosition === position) {
      if (!this._leafletLegendControl) {
        this._updateLegend();
      }
    } else {
      this._legendPosition = position;

      this._updateLegend();
    }
  }

  _updateLegend() {
    if (this._leafletLegendControl) {
      this._leafletMap.removeControl(this._leafletLegendControl);
    }

    const $wrapper = jquery__WEBPACK_IMPORTED_MODULE_2___default()('<div>').addClass('visMapLegend__wrapper');
    this._leafletLegendControl = makeLegendControl($wrapper, this, this._legendPosition);

    this._leafletMap.addControl(this._leafletLegendControl);
  }

  resize() {
    this._leafletMap.invalidateSize();

    this._updateExtent();
  }

  setMinZoom(zoom) {
    this._leafletMap.setMinZoom(zoom);
  }

  setMaxZoom(zoom) {
    this._leafletMap.setMaxZoom(zoom);
  }

  isInside(bucketRectBounds) {
    const mapBounds = this._leafletMap.getBounds();

    return mapBounds.intersects(bucketRectBounds);
  }

  async fitToData() {
    if (!this._leafletMap) {
      return;
    }

    const boundsArray = await Promise.all(this._layers.map(async layer => {
      return await layer.getBounds();
    }));
    let bounds = null;
    boundsArray.forEach(async b => {
      if (bounds) {
        bounds.extend(b);
      } else {
        bounds = b;
      }
    });

    if (bounds && bounds.isValid()) {
      this._leafletMap.fitBounds(bounds);
    }
  }

  _updateExtent() {
    this._layers.forEach(layer => layer.updateExtent());
  }

  persistUiStateForVisualization(visualization) {
    function persistMapStateInUiState() {
      const uiState = visualization.getUiState();
      const centerFromUIState = uiState.get('mapCenter');
      const zoomFromUiState = parseInt(uiState.get('mapZoom'));

      if (isNaN(zoomFromUiState) || this.getZoomLevel() !== zoomFromUiState) {
        visualization.uiStateVal('mapZoom', this.getZoomLevel());
      }

      const centerFromMap = this.getCenter();

      if (!centerFromUIState || centerFromMap.lon !== centerFromUIState[1] || centerFromMap.lat !== centerFromUIState[0]) {
        visualization.uiStateVal('mapCenter', [centerFromMap.lat, centerFromMap.lon]);
      }
    }

    this._leafletMap.on('resize', () => {
      visualization.sessionState.mapBounds = this.getBounds();
    });

    this._leafletMap.on('load', () => {
      visualization.sessionState.mapBounds = this.getBounds();
    });

    this.on('dragend', persistMapStateInUiState);
    this.on('zoomend', persistMapStateInUiState);
  }

  useUiStateFromVisualization(visualization) {
    const uiState = visualization.getUiState();
    const zoomFromUiState = parseInt(uiState.get('mapZoom'));
    const centerFromUIState = uiState.get('mapCenter');

    if (!isNaN(zoomFromUiState)) {
      this.setZoomLevel(zoomFromUiState);
    }

    if (centerFromUIState) {
      this.setCenter(centerFromUIState[0], centerFromUIState[1]);
    }
  }

}

function getAttributionArray(attribution) {
  const attributionString = attribution || '';
  let attributions = attributionString.split(/\s*\|\s*/);

  if (attributions.length === 1) {
    //temp work-around due to inconsistency in manifests of how attributions are delimited
    attributions = attributions[0].split(',');
  }

  return attributions;
}

/***/ }),

/***/ "./public/map/service_settings.js":
/*!****************************************!*\
  !*** ./public/map/service_settings.js ***!
  \****************************************/
/*! exports provided: ServiceSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceSettings", function() { return ServiceSettings; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var markdown_it__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! markdown-it */ "../../node_modules/markdown-it/index.js");
/* harmony import */ var markdown_it__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(markdown_it__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _elastic_ems_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/ems-client */ "../../node_modules/@elastic/ems-client/target/web/index.js");
/* harmony import */ var _common_opensearch_maps_client_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/opensearch_maps_client.js */ "./public/common/opensearch_maps_client.js");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @osd/i18n */ "@osd/i18n");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../maps_explorer_dashboards_services */ "./public/maps_explorer_dashboards_services.ts");
/* harmony import */ var _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/constants/origin */ "./public/common/constants/origin.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */







const TMS_IN_YML_ID = 'TMS in config/opensearch_dashboards.yml';
class ServiceSettings {
  constructor(mapConfig, tilemapsConfig) {
    _defineProperty(this, "_backfillSettings", fileLayer => {
      // Older version of OpenSearch Dashboards stored EMS state in the URL-params
      // Creates object literal with required parameters as key-value pairs
      const format = fileLayer.getDefaultFormatType();
      const meta = fileLayer.getDefaultFormatMeta();
      return {
        name: fileLayer.getDisplayName(),
        origin: fileLayer.getOrigin(),
        id: fileLayer.getId(),
        created_at: fileLayer.getCreatedAt(),
        attribution: getAttributionString(fileLayer),
        fields: fileLayer.getFieldsInLanguage(),
        format: format,
        //legacy: format and meta are split up
        meta: meta //legacy, format and meta are split up

      };
    });

    this._mapConfig = mapConfig;
    this._tilemapsConfig = tilemapsConfig;
    this._hasTmsConfigured = typeof tilemapsConfig.url === 'string' && tilemapsConfig.url !== '';
    this._showZoomMessage = true;
    this._emsClient = null;
    this._opensearchMapsClient = new _common_opensearch_maps_client_js__WEBPACK_IMPORTED_MODULE_3__["OpenSearchMapsClient"]({
      language: _osd_i18n__WEBPACK_IMPORTED_MODULE_4__["i18n"].getLocale(),
      appVersion: Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_5__["getOpenSearchDashboardsVersion"])(),
      appName: 'opensearch-dashboards',
      fileApiUrl: this._mapConfig.emsFileApiUrl,
      tileApiUrl: this._mapConfig.emsTileApiUrl,
      landingPageUrl: '',
      manifestServiceUrl: this._mapConfig.opensearchManifestServiceUrl,
      // Wrap to avoid errors passing window fetch
      fetchFunction: function () {
        return fetch(...arguments);
      }
    });
    this.getTMSOptions();
  }

  getTMSOptions() {
    const markdownIt = new markdown_it__WEBPACK_IMPORTED_MODULE_1___default.a({
      html: false,
      linkify: true
    }); // TMS Options

    this.tmsOptionsFromConfig = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.assign({}, this._tilemapsConfig.options, {
      attribution: lodash__WEBPACK_IMPORTED_MODULE_0___default.a.escape(markdownIt.render(this._tilemapsConfig.options.attribution || '')),
      url: this._tilemapsConfig.url
    });
  }

  shouldShowZoomMessage(_ref) {
    let {
      origin
    } = _ref;
    return origin === _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].EMS && this._showZoomMessage;
  }

  enableZoomMessage() {
    this._showZoomMessage = true;
  }

  disableZoomMessage() {
    this._showZoomMessage = false;
  }

  __debugStubManifestCalls(manifestRetrieval) {
    this._emsClient = this._opensearchMapsClient;
    const oldGetManifest = this._emsClient.getManifest;
    this._emsClient.getManifest = manifestRetrieval;
    return {
      removeStub: () => {
        delete this._emsClient.getManifest; //not strictly necessary since this is prototype method

        if (this._emsClient.getManifest !== oldGetManifest) {
          this._emsClient.getManifest = oldGetManifest;
        }
      }
    };
  }

  // anyone using this._emsClient should call this method before, to set the right client
  async _setMapServices() {
    // if client is not null, return immediately.
    // Effectively, client creation will be called only once.
    if (this._emsClient) {
      return;
    }

    const useOpenSearchMaps = await this._opensearchMapsClient.isEnabled();

    if (useOpenSearchMaps) {
      // using OpenSearch Maps.
      this._emsClient = this._opensearchMapsClient;
    } else {
      // not using OpenSearch Maps, fallback to default maps.
      this._emsClient = new _elastic_ems_client__WEBPACK_IMPORTED_MODULE_2__["EMSClient"]({
        language: _osd_i18n__WEBPACK_IMPORTED_MODULE_4__["i18n"].getLocale(),
        appVersion: Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_5__["getOpenSearchDashboardsVersion"])(),
        appName: 'opensearch-dashboards',
        fileApiUrl: this._mapConfig.emsFileApiUrl,
        tileApiUrl: this._mapConfig.emsTileApiUrl,
        landingPageUrl: this._mapConfig.emsLandingPageUrl,
        fetchFunction: function () {
          return fetch(...arguments);
        }
      });
    }
  }

  async getFileLayers() {
    if (!this._mapConfig.includeOpenSearchMapsService) {
      return [];
    }

    await this._setMapServices();
    const fileLayers = await this._emsClient.getFileLayers();
    return fileLayers.map(this._backfillSettings);
  }
  /**
   * Returns all the services published by EMS (if configures)
   * It also includes the service configured in tilemap (override)
   */


  async getTMSServices() {
    let allServices = [];

    if (this._hasTmsConfigured) {
      //use tilemap.* settings from yml
      const tmsService = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.cloneDeep(this.tmsOptionsFromConfig);

      tmsService.id = TMS_IN_YML_ID;
      tmsService.origin = _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].OPENSEARCH_DASHBOARDS_YML;
      allServices.push(tmsService);
    }

    await this._setMapServices();

    if (this._mapConfig.includeOpenSearchMapsService) {
      const servicesFromManifest = await this._emsClient.getTMSServices();
      const strippedServiceFromManifest = await Promise.all(servicesFromManifest.filter(tmsService => tmsService.getId() === this._mapConfig.emsTileLayerId.bright).map(async tmsService => {
        //shim for compatibility
        return {
          origin: tmsService.getOrigin(),
          id: tmsService.getId(),
          minZoom: await tmsService.getMinZoom(),
          maxZoom: await tmsService.getMaxZoom(),
          attribution: getAttributionString(tmsService)
        };
      }));
      allServices = allServices.concat(strippedServiceFromManifest);
    }

    return allServices;
  }
  /**
   * Set optional query-parameters for all requests
   *
   * @param additionalQueryParams
   */


  setQueryParams(additionalQueryParams) {
    // Functions more as a "set" than an "add" in ems-client
    this._emsClient.addQueryParams(additionalQueryParams);
  }

  async getFileLayerFromConfig(fileLayerConfig) {
    const fileLayers = await this._emsClient.getFileLayers();
    return fileLayers.find(fileLayer => {
      const hasIdByName = fileLayer.hasId(fileLayerConfig.name); //legacy

      const hasIdById = fileLayer.hasId(fileLayerConfig.id);
      return hasIdByName || hasIdById;
    });
  }

  async getEMSHotLink(fileLayerConfig) {
    await this._setMapServices();
    const layer = await this.getFileLayerFromConfig(fileLayerConfig);
    return layer ? layer.getEMSHotLink() : null;
  }

  async loadFileLayerConfig(fileLayerConfig) {
    const fileLayer = await this.getFileLayerFromConfig(fileLayerConfig);
    return fileLayer ? this._backfillSettings(fileLayer) : null;
  }

  async _getAttributesForEMSTMSLayer(isDesaturated, isDarkMode) {
    await this._setMapServices();
    const tmsServices = await this._emsClient.getTMSServices();
    const emsTileLayerId = this._mapConfig.emsTileLayerId;
    let serviceId;

    if (isDarkMode) {
      serviceId = emsTileLayerId.dark;
    } else {
      if (isDesaturated) {
        serviceId = emsTileLayerId.desaturated;
      } else {
        serviceId = emsTileLayerId.bright;
      }
    }

    const tmsService = tmsServices.find(service => {
      return service.getId() === serviceId;
    });
    return {
      url: await tmsService.getUrlTemplate(),
      minZoom: await tmsService.getMinZoom(),
      maxZoom: await tmsService.getMaxZoom(),
      attribution: getAttributionString(tmsService),
      origin: _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].EMS
    };
  }

  async getAttributesForTMSLayer(tmsServiceConfig, isDesaturated, isDarkMode) {
    if (tmsServiceConfig.origin === _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].EMS) {
      return this._getAttributesForEMSTMSLayer(isDesaturated, isDarkMode);
    } else if (tmsServiceConfig.origin === _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].OPENSEARCH_DASHBOARDS_YML) {
      const attrs = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.pick(this._tilemapsConfig, ['url', 'minzoom', 'maxzoom', 'attribution']);

      return { ...attrs,
        ...{
          origin: _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].OPENSEARCH_DASHBOARDS_YML
        }
      };
    } else {
      //this is an older config. need to resolve this dynamically.
      if (tmsServiceConfig.id === TMS_IN_YML_ID) {
        const attrs = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.pick(this._tilemapsConfig, ['url', 'minzoom', 'maxzoom', 'attribution']);

        return { ...attrs,
          ...{
            origin: _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].OPENSEARCH_DASHBOARDS_YML
          }
        };
      } else {
        //assume ems
        return this._getAttributesForEMSTMSLayer(isDesaturated, isDarkMode);
      }
    }
  }

  async _getFileUrlFromEMS(fileLayerConfig) {
    await this._setMapServices();
    const fileLayers = await this._emsClient.getFileLayers();
    const layer = fileLayers.find(fileLayer => {
      const hasIdByName = fileLayer.hasId(fileLayerConfig.name); //legacy

      const hasIdById = fileLayer.hasId(fileLayerConfig.id);
      return hasIdByName || hasIdById;
    });

    if (layer) {
      return layer.getDefaultFormatUrl();
    } else {
      throw new Error(`File  ${fileLayerConfig.name} not recognized`);
    }
  }

  async getUrlForRegionLayer(fileLayerConfig) {
    let url;

    if (fileLayerConfig.origin === _common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].EMS) {
      url = this._getFileUrlFromEMS(fileLayerConfig);
    } else if (fileLayerConfig.layerId && fileLayerConfig.layerId.startsWith(`${_common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].EMS}.`)) {
      //fallback for older saved objects
      url = this._getFileUrlFromEMS(fileLayerConfig);
    } else if (fileLayerConfig.layerId && fileLayerConfig.layerId.startsWith(`${_common_constants_origin__WEBPACK_IMPORTED_MODULE_6__["ORIGIN"].OPENSEARCH_DASHBOARDS_YML}.`)) {
      //fallback for older saved objects
      url = fileLayerConfig.url;
    } else {
      //generic fallback
      url = fileLayerConfig.url;
    }

    return url;
  }

  async getJsonForRegionLayer(fileLayerConfig) {
    const url = await this.getUrlForRegionLayer(fileLayerConfig);
    const response = await fetch(url);
    return await response.json();
  }

}

function getAttributionString(emsService) {
  const attributions = emsService.getAttributions();
  const attributionSnippets = attributions.map(attribution => {
    const anchorTag = document.createElement('a');
    anchorTag.setAttribute('rel', 'noreferrer noopener');

    if (attribution.url.startsWith('http://') || attribution.url.startsWith('https://')) {
      anchorTag.setAttribute('href', attribution.url);
    }

    anchorTag.textContent = attribution.label;
    return anchorTag.outerHTML;
  });
  return attributionSnippets.join(' | '); //!!!this is the current convention used in OpenSearch Dashboards
}

/***/ }),

/***/ "./public/map/zoom_to_precision.ts":
/*!*****************************************!*\
  !*** ./public/map/zoom_to_precision.ts ***!
  \*****************************************/
/*! exports provided: zoomToPrecision */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zoomToPrecision", function() { return zoomToPrecision; });
/* harmony import */ var _decode_geo_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./decode_geo_hash */ "./public/map/decode_geo_hash.ts");
/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

const defaultMaxPrecision = 12;
const minGeoHashPixels = 16;

const calculateZoomToPrecisionMap = maxZoom => {
  /**
   * Map Leaflet zoom levels to geohash precision levels.
   * The size of a geohash column-width on the map should be at least `minGeohashPixels` pixels wide.
   */
  const zoomPrecisionMap = new Map();

  for (let zoom = 0; zoom <= maxZoom; zoom += 1) {
    if (typeof zoomPrecisionMap.get(zoom) === 'number') {
      continue;
    }

    const worldPixels = 256 * Math.pow(2, zoom);
    zoomPrecisionMap.set(zoom, 1);

    for (let precision = 2; precision <= defaultMaxPrecision; precision += 1) {
      const columns = Object(_decode_geo_hash__WEBPACK_IMPORTED_MODULE_0__["geohashColumns"])(precision);

      if (worldPixels / columns >= minGeoHashPixels) {
        zoomPrecisionMap.set(zoom, precision);
      } else {
        break;
      }
    }
  }

  return zoomPrecisionMap;
};

function zoomToPrecision(mapZoom, maxPrecision, maxZoom) {
  const zoomPrecisionMap = calculateZoomToPrecisionMap(typeof maxZoom === 'number' ? maxZoom : 21);
  const precision = zoomPrecisionMap.get(mapZoom);
  return precision ? Math.min(precision, maxPrecision) : maxPrecision;
}

/***/ })

}]);
//# sourceMappingURL=mapsExplorerDashboards.chunk.3.js.map