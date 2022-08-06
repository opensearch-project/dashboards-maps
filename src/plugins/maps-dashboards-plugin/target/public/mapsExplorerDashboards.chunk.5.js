(window["mapsExplorerDashboards_bundle_jsonpfunction"] = window["mapsExplorerDashboards_bundle_jsonpfunction"] || []).push([[5],{

/***/ "./public/map/layer/wms_layer/wms_layer.ts":
/*!*************************************************!*\
  !*** ./public/map/layer/wms_layer/wms_layer.ts ***!
  \*************************************************/
/*! exports provided: WMSLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WMSLayer", function() { return WMSLayer; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../.. */ "./public/index.ts");
/* harmony import */ var _map_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../map_messages */ "./public/map/map_messages.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */


const WMS_MINZOOM = 0;
const WMS_MAXZOOM = 22; //increase this to 22. Better for WMS

/**
 * Construct WMSLayer
 */

class WMSLayer extends ___WEBPACK_IMPORTED_MODULE_0__["OpenSearchDashboardsMapLayer"] {
  constructor(options, opensearchDashboardsMap, leaflet) {
    super(opensearchDashboardsMap, options);

    _defineProperty(this, "_leaflet", void 0);

    _defineProperty(this, "_isDesaturated", void 0);

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
          Object(_map_messages__WEBPACK_IMPORTED_MODULE_1__["createRegionBlockedWarning"])();
        }
      });

      if (this._options.showZoomMessage) {
        leafletLayer.on('add', () => {
          this._opensearchDashboardsMap._addMaxZoomMessage(leafletLayer);
        });
      }
    }

    return leafletLayer;
  }

  _updateDesaturation() {
    Object(_map_messages__WEBPACK_IMPORTED_MODULE_1__["removeRegionBlockedWarning"])();
    const tiles = $('img.leaflet-tile-loaded');

    if (this._isDesaturated) {
      tiles.removeClass('filters-off');
    } else {
      tiles.addClass('filters-off');
    }
  }

  setDesaturate(isDesaturated) {
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


  isReusable(option) {
    return super.isReusable(option) && JSON.stringify(this._options.typeOptions) === JSON.stringify(option.typeOptions);
  }

}

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

/***/ })

}]);
//# sourceMappingURL=mapsExplorerDashboards.chunk.5.js.map