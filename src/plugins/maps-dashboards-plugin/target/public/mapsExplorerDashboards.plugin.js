/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"mapsExplorerDashboards": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "mapsExplorerDashboards.chunk." + chunkId + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["mapsExplorerDashboards_bundle_jsonpfunction"] = window["mapsExplorerDashboards_bundle_jsonpfunction"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../../packages/osd-optimizer/target/worker/entry_point_creator.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/index.scss?v7dark":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-0-1!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-0-2!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-0-3!./public/index.scss?v7dark ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default.a);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n", "",{"version":3,"sources":["webpack://./public/index.scss"],"names":[],"mappings":"AAAA;;;;;EAKE","sourcesContent":["/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/index.scss?v7light":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-1-2!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-1-3!./public/index.scss?v7light ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default.a);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n", "",{"version":3,"sources":["webpack://./public/index.scss"],"names":[],"mappings":"AAAA;;;;;EAKE","sourcesContent":["/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/map/index.scss?v7dark":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-0-1!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-0-2!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-0-3!./public/map/index.scss?v7dark ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default.a);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n.leaflet-touch .leaflet-bar,\n.leaflet-draw-actions {\n  box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.2), 0 4px 4px -1px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.2);\n  border: none; }\n\n.leaflet-container {\n  background: #1D1E24;\n  min-width: 1px !important;\n  min-height: 1px !important; }\n\n.leaflet-clickable:hover {\n  stroke-width: 8px;\n  stroke-opacity: 0.8; }\n\n/**\n * 1. Since Leaflet is an external library, we also have to provide EUI variables\n *    to non-override colors for darkmode.\n */\n.leaflet-draw-actions a,\n.leaflet-control a {\n  background-color: #343741;\n  /* 1 */\n  border-color: #535966 !important;\n  /* 1 */\n  color: #DFE5EF !important;\n  /* 1 */ }\n  .leaflet-draw-actions a:hover,\n  .leaflet-control a:hover {\n    background-color: #25262E; }\n\n.leaflet-touch .leaflet-bar a:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px; }\n\n.leaflet-touch .leaflet-bar a:last-child {\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px; }\n\n.leaflet-retina .leaflet-draw-toolbar a {\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60' height='60' width='600'%3E%3Cg fill='rgb%28223, 229, 239%29'%3E%3Cg%3E%3Cpath d='M18 36v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M36 18v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M23.142 39.145l-2.285-2.29 16-15.998 2.285 2.285z'/%3E%3C/g%3E%3Cpath d='M100 24.565l-2.096 14.83L83.07 42 76 28.773 86.463 18z'/%3E%3Cpath d='M140 20h20v20h-20z'/%3E%3Cpath d='M221 30c0 6.078-4.926 11-11 11s-11-4.922-11-11c0-6.074 4.926-11 11-11s11 4.926 11 11z'/%3E%3Cpath d='M270,19c-4.971,0-9,4.029-9,9c0,4.971,5.001,12,9,14c4.001-2,9-9.029,9-14C279,23.029,274.971,19,270,19z M270,31.5c-2.484,0-4.5-2.014-4.5-4.5c0-2.484,2.016-4.5,4.5-4.5c2.485,0,4.5,2.016,4.5,4.5C274.5,29.486,272.485,31.5,270,31.5z'/%3E%3Cg%3E%3Cpath d='M337,30.156v0.407v5.604c0,1.658-1.344,3-3,3h-10c-1.655,0-3-1.342-3-3v-10c0-1.657,1.345-3,3-3h6.345 l3.19-3.17H324c-3.313,0-6,2.687-6,6v10c0,3.313,2.687,6,6,6h10c3.314,0,6-2.687,6-6v-8.809L337,30.156'/%3E%3Cpath d='M338.72 24.637l-8.892 8.892H327V30.7l8.89-8.89z'/%3E%3Cpath d='M338.697 17.826h4v4h-4z' transform='rotate(-134.99 340.703 19.817)'/%3E%3C/g%3E%3Cg%3E%3Cpath d='M381 42h18V24h-18v18zm14-16h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26z'/%3E%3Cpath d='M395 20v-4h-10v4h-6v2h22v-2h-6zm-2 0h-6v-2h6v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\");\n  /* 1 */ }\n\n.leaflet-control-layers-expanded {\n  padding: 0;\n  margin: 0;\n  font-size: 11px;\n  font-size: 0.6875rem;\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5; }\n  .leaflet-control-layers-expanded label {\n    font-weight: 500;\n    margin: 0;\n    padding: 0; }\n\n/* over-rides leaflet popup styles to look like OpenSearch Dashboards tooltip */\n.leaflet-popup-content-wrapper {\n  margin: 0;\n  padding: 0;\n  background: #1a1a1a;\n  color: #FFF;\n  border-radius: 4px !important; }\n\n.leaflet-popup {\n  pointer-events: none; }\n\n.leaflet-popup-content {\n  margin: 0;\n  font-size: 14px;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  font-weight: 400;\n  word-wrap: break-word;\n  overflow: hidden;\n  pointer-events: none; }\n  .leaflet-popup-content > * {\n    margin: 8px 8px 0; }\n  .leaflet-popup-content > :last-child {\n    margin-bottom: 8px; }\n  .leaflet-popup-content table td, .leaflet-popup-content table th {\n    padding: 4px; }\n\n.leaflet-popup-tip-container,\n.leaflet-popup-close-button,\n.leaflet-draw-tooltip {\n  display: none !important; }\n\n.leaflet-container .leaflet-control-attribution {\n  background-color: rgba(29, 30, 36, 0.3);\n  color: #98A2B3; }\n  .leaflet-container .leaflet-control-attribution p {\n    display: inline; }\n\n.leaflet-touch .leaflet-control-zoom-in,\n.leaflet-touch .leaflet-control-zoom-out {\n  text-indent: -10000px;\n  background-repeat: no-repeat;\n  background-position: center; }\n\n.leaflet-touch .leaflet-control-zoom-in {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%28223, 229, 239%29' d='M8,7 L8,3.5 C8,3.22385763 7.77614237,3 7.5,3 C7.22385763,3 7,3.22385763 7,3.5 L7,7 L3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L7,8 L7,11.5 C7,11.7761424 7.22385763,12 7.5,12 C7.77614237,12 8,11.7761424 8,11.5 L8,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L8,7 Z M7.5,15 C3.35786438,15 0,11.6421356 0,7.5 C0,3.35786438 3.35786438,0 7.5,0 C11.6421356,0 15,3.35786438 15,7.5 C15,11.6421356 11.6421356,15 7.5,15 Z' /%3E%3C/svg%3E\"); }\n\n.leaflet-touch .leaflet-control-zoom-out {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%28223, 229, 239%29' d='M7.5,0 C11.6355882,0 15,3.36441176 15,7.5 C15,11.6355882 11.6355882,15 7.5,15 C3.36441176,15 0,11.6355882 0,7.5 C0,3.36441176 3.36441176,0 7.5,0 Z M3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L3.5,7 Z' /%3E%3C/svg%3E\"); }\n\nimg.leaflet-tile {\n  filter: invert(1) brightness(1.75) grayscale(1); }\n\nimg.leaflet-tile.filters-off {\n  filter: none; }\n\n.visMapLegend {\n  font-size: 11px;\n  font-size: 0.6875rem;\n  box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.1);\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5;\n  color: #98A2B3;\n  padding: 8px;\n  background: rgba(29, 30, 36, 0.8);\n  border-radius: 4px; }\n  .visMapLegend i {\n    width: 10px;\n    height: 10px;\n    display: inline-block;\n    margin: 3px 4px 0 0;\n    border-radius: 50%;\n    border: 1px solid #98A2B3;\n    background: #98A2B3; }\n\n.visMapLegend__title {\n  font-weight: 700; }\n\n.leaflet-top.leaflet-left .visMapLegend__wrapper {\n  position: absolute;\n  left: 40px;\n  white-space: nowrap; }\n", "",{"version":3,"sources":["webpack://./public/map/index.scss"],"names":[],"mappings":"AAAA;;;;;EAKE;AACF;;EAEE,iHAAiH;EACjH,YAAY,EAAE;;AAEhB;EACE,mBAAmB;EACnB,yBAAyB;EACzB,0BAA0B,EAAE;;AAE9B;EACE,iBAAiB;EACjB,mBAAmB,EAAE;;AAEvB;;;EAGE;AACF;;EAEE,yBAAyB;EACzB,MAAM;EACN,gCAAgC;EAChC,MAAM;EACN,yBAAyB;EACzB,MAAM,EAAE;EACR;;IAEE,yBAAyB,EAAE;;AAE/B;EACE,2BAA2B;EAC3B,4BAA4B,EAAE;;AAEhC;EACE,8BAA8B;EAC9B,+BAA+B,EAAE;;AAEnC;EACE,41CAA41C;EAC51C,MAAM,EAAE;;AAEV;EACE,UAAU;EACV,SAAS;EACT,eAAe;EACf,oBAAoB;EACpB,8JAA8J;EAC9J,gBAAgB;EAChB,gBAAgB,EAAE;EAClB;IACE,gBAAgB;IAChB,SAAS;IACT,UAAU,EAAE;;AAEhB,+EAA+E;AAC/E;EACE,SAAS;EACT,UAAU;EACV,mBAAmB;EACnB,WAAW;EACX,6BAA6B,EAAE;;AAEjC;EACE,oBAAoB,EAAE;;AAExB;EACE,SAAS;EACT,eAAe;EACf,mBAAmB;EACnB,gBAAgB;EAChB,gBAAgB;EAChB,qBAAqB;EACrB,gBAAgB;EAChB,oBAAoB,EAAE;EACtB;IACE,iBAAiB,EAAE;EACrB;IACE,kBAAkB,EAAE;EACtB;IACE,YAAY,EAAE;;AAElB;;;EAGE,wBAAwB,EAAE;;AAE5B;EACE,uCAAuC;EACvC,cAAc,EAAE;EAChB;IACE,eAAe,EAAE;;AAErB;;EAEE,qBAAqB;EACrB,4BAA4B;EAC5B,2BAA2B,EAAE;;AAE/B;EACE,6qBAA6qB,EAAE;;AAEjrB;EACE,mgBAAmgB,EAAE;;AAEvgB;EACE,+CAA+C,EAAE;;AAEnD;EACE,YAAY,EAAE;;AAEhB;EACE,eAAe;EACf,oBAAoB;EACpB,iHAAiH;EACjH,8JAA8J;EAC9J,gBAAgB;EAChB,gBAAgB;EAChB,cAAc;EACd,YAAY;EACZ,iCAAiC;EACjC,kBAAkB,EAAE;EACpB;IACE,WAAW;IACX,YAAY;IACZ,qBAAqB;IACrB,mBAAmB;IACnB,kBAAkB;IAClB,yBAAyB;IACzB,mBAAmB,EAAE;;AAEzB;EACE,gBAAgB,EAAE;;AAEpB;EACE,kBAAkB;EAClB,UAAU;EACV,mBAAmB,EAAE","sourcesContent":["/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n.leaflet-touch .leaflet-bar,\n.leaflet-draw-actions {\n  box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.2), 0 4px 4px -1px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.2);\n  border: none; }\n\n.leaflet-container {\n  background: #1D1E24;\n  min-width: 1px !important;\n  min-height: 1px !important; }\n\n.leaflet-clickable:hover {\n  stroke-width: 8px;\n  stroke-opacity: 0.8; }\n\n/**\n * 1. Since Leaflet is an external library, we also have to provide EUI variables\n *    to non-override colors for darkmode.\n */\n.leaflet-draw-actions a,\n.leaflet-control a {\n  background-color: #343741;\n  /* 1 */\n  border-color: #535966 !important;\n  /* 1 */\n  color: #DFE5EF !important;\n  /* 1 */ }\n  .leaflet-draw-actions a:hover,\n  .leaflet-control a:hover {\n    background-color: #25262E; }\n\n.leaflet-touch .leaflet-bar a:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px; }\n\n.leaflet-touch .leaflet-bar a:last-child {\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px; }\n\n.leaflet-retina .leaflet-draw-toolbar a {\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60' height='60' width='600'%3E%3Cg fill='rgb%28223, 229, 239%29'%3E%3Cg%3E%3Cpath d='M18 36v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M36 18v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M23.142 39.145l-2.285-2.29 16-15.998 2.285 2.285z'/%3E%3C/g%3E%3Cpath d='M100 24.565l-2.096 14.83L83.07 42 76 28.773 86.463 18z'/%3E%3Cpath d='M140 20h20v20h-20z'/%3E%3Cpath d='M221 30c0 6.078-4.926 11-11 11s-11-4.922-11-11c0-6.074 4.926-11 11-11s11 4.926 11 11z'/%3E%3Cpath d='M270,19c-4.971,0-9,4.029-9,9c0,4.971,5.001,12,9,14c4.001-2,9-9.029,9-14C279,23.029,274.971,19,270,19z M270,31.5c-2.484,0-4.5-2.014-4.5-4.5c0-2.484,2.016-4.5,4.5-4.5c2.485,0,4.5,2.016,4.5,4.5C274.5,29.486,272.485,31.5,270,31.5z'/%3E%3Cg%3E%3Cpath d='M337,30.156v0.407v5.604c0,1.658-1.344,3-3,3h-10c-1.655,0-3-1.342-3-3v-10c0-1.657,1.345-3,3-3h6.345 l3.19-3.17H324c-3.313,0-6,2.687-6,6v10c0,3.313,2.687,6,6,6h10c3.314,0,6-2.687,6-6v-8.809L337,30.156'/%3E%3Cpath d='M338.72 24.637l-8.892 8.892H327V30.7l8.89-8.89z'/%3E%3Cpath d='M338.697 17.826h4v4h-4z' transform='rotate(-134.99 340.703 19.817)'/%3E%3C/g%3E%3Cg%3E%3Cpath d='M381 42h18V24h-18v18zm14-16h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26z'/%3E%3Cpath d='M395 20v-4h-10v4h-6v2h22v-2h-6zm-2 0h-6v-2h6v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\");\n  /* 1 */ }\n\n.leaflet-control-layers-expanded {\n  padding: 0;\n  margin: 0;\n  font-size: 11px;\n  font-size: 0.6875rem;\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5; }\n  .leaflet-control-layers-expanded label {\n    font-weight: 500;\n    margin: 0;\n    padding: 0; }\n\n/* over-rides leaflet popup styles to look like OpenSearch Dashboards tooltip */\n.leaflet-popup-content-wrapper {\n  margin: 0;\n  padding: 0;\n  background: #1a1a1a;\n  color: #FFF;\n  border-radius: 4px !important; }\n\n.leaflet-popup {\n  pointer-events: none; }\n\n.leaflet-popup-content {\n  margin: 0;\n  font-size: 14px;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  font-weight: 400;\n  word-wrap: break-word;\n  overflow: hidden;\n  pointer-events: none; }\n  .leaflet-popup-content > * {\n    margin: 8px 8px 0; }\n  .leaflet-popup-content > :last-child {\n    margin-bottom: 8px; }\n  .leaflet-popup-content table td, .leaflet-popup-content table th {\n    padding: 4px; }\n\n.leaflet-popup-tip-container,\n.leaflet-popup-close-button,\n.leaflet-draw-tooltip {\n  display: none !important; }\n\n.leaflet-container .leaflet-control-attribution {\n  background-color: rgba(29, 30, 36, 0.3);\n  color: #98A2B3; }\n  .leaflet-container .leaflet-control-attribution p {\n    display: inline; }\n\n.leaflet-touch .leaflet-control-zoom-in,\n.leaflet-touch .leaflet-control-zoom-out {\n  text-indent: -10000px;\n  background-repeat: no-repeat;\n  background-position: center; }\n\n.leaflet-touch .leaflet-control-zoom-in {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%28223, 229, 239%29' d='M8,7 L8,3.5 C8,3.22385763 7.77614237,3 7.5,3 C7.22385763,3 7,3.22385763 7,3.5 L7,7 L3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L7,8 L7,11.5 C7,11.7761424 7.22385763,12 7.5,12 C7.77614237,12 8,11.7761424 8,11.5 L8,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L8,7 Z M7.5,15 C3.35786438,15 0,11.6421356 0,7.5 C0,3.35786438 3.35786438,0 7.5,0 C11.6421356,0 15,3.35786438 15,7.5 C15,11.6421356 11.6421356,15 7.5,15 Z' /%3E%3C/svg%3E\"); }\n\n.leaflet-touch .leaflet-control-zoom-out {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%28223, 229, 239%29' d='M7.5,0 C11.6355882,0 15,3.36441176 15,7.5 C15,11.6355882 11.6355882,15 7.5,15 C3.36441176,15 0,11.6355882 0,7.5 C0,3.36441176 3.36441176,0 7.5,0 Z M3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L3.5,7 Z' /%3E%3C/svg%3E\"); }\n\nimg.leaflet-tile {\n  filter: invert(1) brightness(1.75) grayscale(1); }\n\nimg.leaflet-tile.filters-off {\n  filter: none; }\n\n.visMapLegend {\n  font-size: 11px;\n  font-size: 0.6875rem;\n  box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.1);\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5;\n  color: #98A2B3;\n  padding: 8px;\n  background: rgba(29, 30, 36, 0.8);\n  border-radius: 4px; }\n  .visMapLegend i {\n    width: 10px;\n    height: 10px;\n    display: inline-block;\n    margin: 3px 4px 0 0;\n    border-radius: 50%;\n    border: 1px solid #98A2B3;\n    background: #98A2B3; }\n\n.visMapLegend__title {\n  font-weight: 700; }\n\n.leaflet-top.leaflet-left .visMapLegend__wrapper {\n  position: absolute;\n  left: 40px;\n  white-space: nowrap; }\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/map/index.scss?v7light":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-1-2!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-1-3!./public/map/index.scss?v7light ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default.a);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n.leaflet-touch .leaflet-bar,\n.leaflet-draw-actions {\n  box-shadow: 0 6px 12px -1px rgba(65, 78, 101, 0.2), 0 4px 4px -1px rgba(65, 78, 101, 0.2), 0 2px 2px 0 rgba(65, 78, 101, 0.2);\n  border: none; }\n\n.leaflet-container {\n  background: #FFF;\n  min-width: 1px !important;\n  min-height: 1px !important; }\n\n.leaflet-clickable:hover {\n  stroke-width: 8px;\n  stroke-opacity: 0.8; }\n\n/**\n * 1. Since Leaflet is an external library, we also have to provide EUI variables\n *    to non-override colors for darkmode.\n */\n.leaflet-draw-actions a,\n.leaflet-control a {\n  background-color: #FFF;\n  /* 1 */\n  border-color: #D3DAE6 !important;\n  /* 1 */\n  color: #343741 !important;\n  /* 1 */ }\n  .leaflet-draw-actions a:hover,\n  .leaflet-control a:hover {\n    background-color: #F5F7FA; }\n\n.leaflet-touch .leaflet-bar a:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px; }\n\n.leaflet-touch .leaflet-bar a:last-child {\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px; }\n\n.leaflet-retina .leaflet-draw-toolbar a {\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60' height='60' width='600'%3E%3Cg fill='rgb%2852, 55, 65%29'%3E%3Cg%3E%3Cpath d='M18 36v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M36 18v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M23.142 39.145l-2.285-2.29 16-15.998 2.285 2.285z'/%3E%3C/g%3E%3Cpath d='M100 24.565l-2.096 14.83L83.07 42 76 28.773 86.463 18z'/%3E%3Cpath d='M140 20h20v20h-20z'/%3E%3Cpath d='M221 30c0 6.078-4.926 11-11 11s-11-4.922-11-11c0-6.074 4.926-11 11-11s11 4.926 11 11z'/%3E%3Cpath d='M270,19c-4.971,0-9,4.029-9,9c0,4.971,5.001,12,9,14c4.001-2,9-9.029,9-14C279,23.029,274.971,19,270,19z M270,31.5c-2.484,0-4.5-2.014-4.5-4.5c0-2.484,2.016-4.5,4.5-4.5c2.485,0,4.5,2.016,4.5,4.5C274.5,29.486,272.485,31.5,270,31.5z'/%3E%3Cg%3E%3Cpath d='M337,30.156v0.407v5.604c0,1.658-1.344,3-3,3h-10c-1.655,0-3-1.342-3-3v-10c0-1.657,1.345-3,3-3h6.345 l3.19-3.17H324c-3.313,0-6,2.687-6,6v10c0,3.313,2.687,6,6,6h10c3.314,0,6-2.687,6-6v-8.809L337,30.156'/%3E%3Cpath d='M338.72 24.637l-8.892 8.892H327V30.7l8.89-8.89z'/%3E%3Cpath d='M338.697 17.826h4v4h-4z' transform='rotate(-134.99 340.703 19.817)'/%3E%3C/g%3E%3Cg%3E%3Cpath d='M381 42h18V24h-18v18zm14-16h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26z'/%3E%3Cpath d='M395 20v-4h-10v4h-6v2h22v-2h-6zm-2 0h-6v-2h6v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\");\n  /* 1 */ }\n\n.leaflet-control-layers-expanded {\n  padding: 0;\n  margin: 0;\n  font-size: 11px;\n  font-size: 0.6875rem;\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5; }\n  .leaflet-control-layers-expanded label {\n    font-weight: 500;\n    margin: 0;\n    padding: 0; }\n\n/* over-rides leaflet popup styles to look like OpenSearch Dashboards tooltip */\n.leaflet-popup-content-wrapper {\n  margin: 0;\n  padding: 0;\n  background: #404040;\n  color: #FFF;\n  border-radius: 4px !important; }\n\n.leaflet-popup {\n  pointer-events: none; }\n\n.leaflet-popup-content {\n  margin: 0;\n  font-size: 14px;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  font-weight: 400;\n  word-wrap: break-word;\n  overflow: hidden;\n  pointer-events: none; }\n  .leaflet-popup-content > * {\n    margin: 8px 8px 0; }\n  .leaflet-popup-content > :last-child {\n    margin-bottom: 8px; }\n  .leaflet-popup-content table td, .leaflet-popup-content table th {\n    padding: 4px; }\n\n.leaflet-popup-tip-container,\n.leaflet-popup-close-button,\n.leaflet-draw-tooltip {\n  display: none !important; }\n\n.leaflet-container .leaflet-control-attribution {\n  background-color: rgba(255, 255, 255, 0.3);\n  color: #69707D; }\n  .leaflet-container .leaflet-control-attribution p {\n    display: inline; }\n\n.leaflet-touch .leaflet-control-zoom-in,\n.leaflet-touch .leaflet-control-zoom-out {\n  text-indent: -10000px;\n  background-repeat: no-repeat;\n  background-position: center; }\n\n.leaflet-touch .leaflet-control-zoom-in {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%2852, 55, 65%29' d='M8,7 L8,3.5 C8,3.22385763 7.77614237,3 7.5,3 C7.22385763,3 7,3.22385763 7,3.5 L7,7 L3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L7,8 L7,11.5 C7,11.7761424 7.22385763,12 7.5,12 C7.77614237,12 8,11.7761424 8,11.5 L8,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L8,7 Z M7.5,15 C3.35786438,15 0,11.6421356 0,7.5 C0,3.35786438 3.35786438,0 7.5,0 C11.6421356,0 15,3.35786438 15,7.5 C15,11.6421356 11.6421356,15 7.5,15 Z' /%3E%3C/svg%3E\"); }\n\n.leaflet-touch .leaflet-control-zoom-out {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%2852, 55, 65%29' d='M7.5,0 C11.6355882,0 15,3.36441176 15,7.5 C15,11.6355882 11.6355882,15 7.5,15 C3.36441176,15 0,11.6355882 0,7.5 C0,3.36441176 3.36441176,0 7.5,0 Z M3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L3.5,7 Z' /%3E%3C/svg%3E\"); }\n\nimg.leaflet-tile {\n  filter: brightness(1.03) grayscale(0.73); }\n\nimg.leaflet-tile.filters-off {\n  filter: none; }\n\n.visMapLegend {\n  font-size: 11px;\n  font-size: 0.6875rem;\n  box-shadow: 0 6px 12px -1px rgba(65, 78, 101, 0.1), 0 4px 4px -1px rgba(65, 78, 101, 0.1), 0 2px 2px 0 rgba(65, 78, 101, 0.1);\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5;\n  color: #69707D;\n  padding: 8px;\n  background: rgba(255, 255, 255, 0.8);\n  border-radius: 4px; }\n  .visMapLegend i {\n    width: 10px;\n    height: 10px;\n    display: inline-block;\n    margin: 3px 4px 0 0;\n    border-radius: 50%;\n    border: 1px solid #69707D;\n    background: #69707D; }\n\n.visMapLegend__title {\n  font-weight: 700; }\n\n.leaflet-top.leaflet-left .visMapLegend__wrapper {\n  position: absolute;\n  left: 40px;\n  white-space: nowrap; }\n", "",{"version":3,"sources":["webpack://./public/map/index.scss"],"names":[],"mappings":"AAAA;;;;;EAKE;AACF;;EAEE,6HAA6H;EAC7H,YAAY,EAAE;;AAEhB;EACE,gBAAgB;EAChB,yBAAyB;EACzB,0BAA0B,EAAE;;AAE9B;EACE,iBAAiB;EACjB,mBAAmB,EAAE;;AAEvB;;;EAGE;AACF;;EAEE,sBAAsB;EACtB,MAAM;EACN,gCAAgC;EAChC,MAAM;EACN,yBAAyB;EACzB,MAAM,EAAE;EACR;;IAEE,yBAAyB,EAAE;;AAE/B;EACE,2BAA2B;EAC3B,4BAA4B,EAAE;;AAEhC;EACE,8BAA8B;EAC9B,+BAA+B,EAAE;;AAEnC;EACE,y1CAAy1C;EACz1C,MAAM,EAAE;;AAEV;EACE,UAAU;EACV,SAAS;EACT,eAAe;EACf,oBAAoB;EACpB,8JAA8J;EAC9J,gBAAgB;EAChB,gBAAgB,EAAE;EAClB;IACE,gBAAgB;IAChB,SAAS;IACT,UAAU,EAAE;;AAEhB,+EAA+E;AAC/E;EACE,SAAS;EACT,UAAU;EACV,mBAAmB;EACnB,WAAW;EACX,6BAA6B,EAAE;;AAEjC;EACE,oBAAoB,EAAE;;AAExB;EACE,SAAS;EACT,eAAe;EACf,mBAAmB;EACnB,gBAAgB;EAChB,gBAAgB;EAChB,qBAAqB;EACrB,gBAAgB;EAChB,oBAAoB,EAAE;EACtB;IACE,iBAAiB,EAAE;EACrB;IACE,kBAAkB,EAAE;EACtB;IACE,YAAY,EAAE;;AAElB;;;EAGE,wBAAwB,EAAE;;AAE5B;EACE,0CAA0C;EAC1C,cAAc,EAAE;EAChB;IACE,eAAe,EAAE;;AAErB;;EAEE,qBAAqB;EACrB,4BAA4B;EAC5B,2BAA2B,EAAE;;AAE/B;EACE,0qBAA0qB,EAAE;;AAE9qB;EACE,ggBAAggB,EAAE;;AAEpgB;EACE,wCAAwC,EAAE;;AAE5C;EACE,YAAY,EAAE;;AAEhB;EACE,eAAe;EACf,oBAAoB;EACpB,6HAA6H;EAC7H,8JAA8J;EAC9J,gBAAgB;EAChB,gBAAgB;EAChB,cAAc;EACd,YAAY;EACZ,oCAAoC;EACpC,kBAAkB,EAAE;EACpB;IACE,WAAW;IACX,YAAY;IACZ,qBAAqB;IACrB,mBAAmB;IACnB,kBAAkB;IAClB,yBAAyB;IACzB,mBAAmB,EAAE;;AAEzB;EACE,gBAAgB,EAAE;;AAEpB;EACE,kBAAkB;EAClB,UAAU;EACV,mBAAmB,EAAE","sourcesContent":["/**\n * 1. Focus rings shouldn't be visible on scrollable regions, but a11y requires them to be focusable.\n *    Browser's supporting `:focus-visible` will still show outline on keyboard focus only.\n *    Others like Safari, won't show anything at all.\n * 2. Force the `:focus-visible` when the `tabindex=0` (is tabbable)\n */\n.leaflet-touch .leaflet-bar,\n.leaflet-draw-actions {\n  box-shadow: 0 6px 12px -1px rgba(65, 78, 101, 0.2), 0 4px 4px -1px rgba(65, 78, 101, 0.2), 0 2px 2px 0 rgba(65, 78, 101, 0.2);\n  border: none; }\n\n.leaflet-container {\n  background: #FFF;\n  min-width: 1px !important;\n  min-height: 1px !important; }\n\n.leaflet-clickable:hover {\n  stroke-width: 8px;\n  stroke-opacity: 0.8; }\n\n/**\n * 1. Since Leaflet is an external library, we also have to provide EUI variables\n *    to non-override colors for darkmode.\n */\n.leaflet-draw-actions a,\n.leaflet-control a {\n  background-color: #FFF;\n  /* 1 */\n  border-color: #D3DAE6 !important;\n  /* 1 */\n  color: #343741 !important;\n  /* 1 */ }\n  .leaflet-draw-actions a:hover,\n  .leaflet-control a:hover {\n    background-color: #F5F7FA; }\n\n.leaflet-touch .leaflet-bar a:first-child {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px; }\n\n.leaflet-touch .leaflet-bar a:last-child {\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px; }\n\n.leaflet-retina .leaflet-draw-toolbar a {\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60' height='60' width='600'%3E%3Cg fill='rgb%2852, 55, 65%29'%3E%3Cg%3E%3Cpath d='M18 36v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M36 18v6h6v-6h-6zm4 4h-2v-2h2v2z'/%3E%3Cpath d='M23.142 39.145l-2.285-2.29 16-15.998 2.285 2.285z'/%3E%3C/g%3E%3Cpath d='M100 24.565l-2.096 14.83L83.07 42 76 28.773 86.463 18z'/%3E%3Cpath d='M140 20h20v20h-20z'/%3E%3Cpath d='M221 30c0 6.078-4.926 11-11 11s-11-4.922-11-11c0-6.074 4.926-11 11-11s11 4.926 11 11z'/%3E%3Cpath d='M270,19c-4.971,0-9,4.029-9,9c0,4.971,5.001,12,9,14c4.001-2,9-9.029,9-14C279,23.029,274.971,19,270,19z M270,31.5c-2.484,0-4.5-2.014-4.5-4.5c0-2.484,2.016-4.5,4.5-4.5c2.485,0,4.5,2.016,4.5,4.5C274.5,29.486,272.485,31.5,270,31.5z'/%3E%3Cg%3E%3Cpath d='M337,30.156v0.407v5.604c0,1.658-1.344,3-3,3h-10c-1.655,0-3-1.342-3-3v-10c0-1.657,1.345-3,3-3h6.345 l3.19-3.17H324c-3.313,0-6,2.687-6,6v10c0,3.313,2.687,6,6,6h10c3.314,0,6-2.687,6-6v-8.809L337,30.156'/%3E%3Cpath d='M338.72 24.637l-8.892 8.892H327V30.7l8.89-8.89z'/%3E%3Cpath d='M338.697 17.826h4v4h-4z' transform='rotate(-134.99 340.703 19.817)'/%3E%3C/g%3E%3Cg%3E%3Cpath d='M381 42h18V24h-18v18zm14-16h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26zm-4 0h2v14h-2V26z'/%3E%3Cpath d='M395 20v-4h-10v4h-6v2h22v-2h-6zm-2 0h-6v-2h6v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\");\n  /* 1 */ }\n\n.leaflet-control-layers-expanded {\n  padding: 0;\n  margin: 0;\n  font-size: 11px;\n  font-size: 0.6875rem;\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5; }\n  .leaflet-control-layers-expanded label {\n    font-weight: 500;\n    margin: 0;\n    padding: 0; }\n\n/* over-rides leaflet popup styles to look like OpenSearch Dashboards tooltip */\n.leaflet-popup-content-wrapper {\n  margin: 0;\n  padding: 0;\n  background: #404040;\n  color: #FFF;\n  border-radius: 4px !important; }\n\n.leaflet-popup {\n  pointer-events: none; }\n\n.leaflet-popup-content {\n  margin: 0;\n  font-size: 14px;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  font-weight: 400;\n  word-wrap: break-word;\n  overflow: hidden;\n  pointer-events: none; }\n  .leaflet-popup-content > * {\n    margin: 8px 8px 0; }\n  .leaflet-popup-content > :last-child {\n    margin-bottom: 8px; }\n  .leaflet-popup-content table td, .leaflet-popup-content table th {\n    padding: 4px; }\n\n.leaflet-popup-tip-container,\n.leaflet-popup-close-button,\n.leaflet-draw-tooltip {\n  display: none !important; }\n\n.leaflet-container .leaflet-control-attribution {\n  background-color: rgba(255, 255, 255, 0.3);\n  color: #69707D; }\n  .leaflet-container .leaflet-control-attribution p {\n    display: inline; }\n\n.leaflet-touch .leaflet-control-zoom-in,\n.leaflet-touch .leaflet-control-zoom-out {\n  text-indent: -10000px;\n  background-repeat: no-repeat;\n  background-position: center; }\n\n.leaflet-touch .leaflet-control-zoom-in {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%2852, 55, 65%29' d='M8,7 L8,3.5 C8,3.22385763 7.77614237,3 7.5,3 C7.22385763,3 7,3.22385763 7,3.5 L7,7 L3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L7,8 L7,11.5 C7,11.7761424 7.22385763,12 7.5,12 C7.77614237,12 8,11.7761424 8,11.5 L8,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L8,7 Z M7.5,15 C3.35786438,15 0,11.6421356 0,7.5 C0,3.35786438 3.35786438,0 7.5,0 C11.6421356,0 15,3.35786438 15,7.5 C15,11.6421356 11.6421356,15 7.5,15 Z' /%3E%3C/svg%3E\"); }\n\n.leaflet-touch .leaflet-control-zoom-out {\n  background-image: url(\"data:image/svg+xml,%0A%3Csvg width='15px' height='15px' viewBox='0 0 15 15' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgb%2852, 55, 65%29' d='M7.5,0 C11.6355882,0 15,3.36441176 15,7.5 C15,11.6355882 11.6355882,15 7.5,15 C3.36441176,15 0,11.6355882 0,7.5 C0,3.36441176 3.36441176,0 7.5,0 Z M3.5,7 C3.22385763,7 3,7.22385763 3,7.5 C3,7.77614237 3.22385763,8 3.5,8 L11.5,8 C11.7761424,8 12,7.77614237 12,7.5 C12,7.22385763 11.7761424,7 11.5,7 L3.5,7 Z' /%3E%3C/svg%3E\"); }\n\nimg.leaflet-tile {\n  filter: brightness(1.03) grayscale(0.73); }\n\nimg.leaflet-tile.filters-off {\n  filter: none; }\n\n.visMapLegend {\n  font-size: 11px;\n  font-size: 0.6875rem;\n  box-shadow: 0 6px 12px -1px rgba(65, 78, 101, 0.1), 0 4px 4px -1px rgba(65, 78, 101, 0.1), 0 2px 2px 0 rgba(65, 78, 101, 0.1);\n  font-family: \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-weight: 500;\n  line-height: 1.5;\n  color: #69707D;\n  padding: 8px;\n  background: rgba(255, 255, 255, 0.8);\n  border-radius: 4px; }\n  .visMapLegend i {\n    width: 10px;\n    height: 10px;\n    display: inline-block;\n    margin: 3px 4px 0 0;\n    border-radius: 50%;\n    border: 1px solid #69707D;\n    background: #69707D; }\n\n.visMapLegend__title {\n  font-weight: 700; }\n\n.leaflet-top.leaflet-left .visMapLegend__wrapper {\n  position: absolute;\n  left: 40px;\n  white-space: nowrap; }\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/runtime/api.js":
/*!**************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/css-loader/dist/runtime/api.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!*********************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "../../node_modules/events/events.js":
/*!************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/events/events.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*************************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "../../node_modules/val-loader/dist/cjs.js?key=mapsExplorerDashboards!../../packages/osd-ui-shared-deps/public_path_module_creator.js":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/node_modules/val-loader/dist/cjs.js?key=mapsExplorerDashboards!/Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/packages/osd-ui-shared-deps/public_path_module_creator.js ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__.p = window.__osdPublicPath__['mapsExplorerDashboards']

/***/ }),

/***/ "../../packages/osd-optimizer/target/worker/entry_point_creator.js":
/*!******************************************************************************************************************************!*\
  !*** /Users/dhshivam/Documents/GitHub/2.2/OpenSearch-Dashboards/packages/osd-optimizer/target/worker/entry_point_creator.js ***!
  \******************************************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_val_loader_dist_cjs_js_key_mapsExplorerDashboards_osd_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/val-loader/dist/cjs.js?key=mapsExplorerDashboards!../../../osd-ui-shared-deps/public_path_module_creator.js */ "../../node_modules/val-loader/dist/cjs.js?key=mapsExplorerDashboards!../../packages/osd-ui-shared-deps/public_path_module_creator.js");
/* harmony import */ var _node_modules_val_loader_dist_cjs_js_key_mapsExplorerDashboards_osd_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_val_loader_dist_cjs_js_key_mapsExplorerDashboards_osd_ui_shared_deps_public_path_module_creator_js__WEBPACK_IMPORTED_MODULE_0__);
__osdBundles__.define('plugin/mapsExplorerDashboards/public', __webpack_require__, /*require.resolve*/(/*! ../../../../plugins/maps-dashboards-plugin/public */ "./public/index.ts"))

/***/ }),

/***/ "./public/common/constants/option.ts":
/*!*******************************************!*\
  !*** ./public/common/constants/option.ts ***!
  \*******************************************/
/*! exports provided: DEFAULT_CONFIGURATION_MINZOOM, DEFAULT_CONFIGURATION_MAXZOOM, DEFAULT_CONFIGURATION_STEP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_CONFIGURATION_MINZOOM", function() { return DEFAULT_CONFIGURATION_MINZOOM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_CONFIGURATION_MAXZOOM", function() { return DEFAULT_CONFIGURATION_MAXZOOM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_CONFIGURATION_STEP", function() { return DEFAULT_CONFIGURATION_STEP; });
const DEFAULT_CONFIGURATION_MINZOOM = 0;
const DEFAULT_CONFIGURATION_MAXZOOM = 14;
const DEFAULT_CONFIGURATION_STEP = 1;

/***/ }),

/***/ "./public/common/constants/origin.ts":
/*!*******************************************!*\
  !*** ./public/common/constants/origin.ts ***!
  \*******************************************/
/*! exports provided: ORIGIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ORIGIN", function() { return ORIGIN; });
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
const ORIGIN = {
  // TODO: Rename EMS
  EMS: 'elastic_maps_service',
  OPENSEARCH_DASHBOARDS_YML: 'self_hosted'
};

/***/ }),

/***/ "./public/common/types/external_basemap_types.ts":
/*!*******************************************************!*\
  !*** ./public/common/types/external_basemap_types.ts ***!
  \*******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./public/common/types/index.ts":
/*!**************************************!*\
  !*** ./public/common/types/index.ts ***!
  \**************************************/
/*! exports provided: MapTypes, LayerTypes, DEFAULT_MAP_EXPLORER_VIS_PARAMS, DEFAULT_NEW_LAYER_OPTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _external_basemap_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./external_basemap_types */ "./public/common/types/external_basemap_types.ts");
/* empty/unused harmony star reexport *//* harmony import */ var _map_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map_types */ "./public/common/types/map_types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MapTypes", function() { return _map_types__WEBPACK_IMPORTED_MODULE_1__["MapTypes"]; });

/* harmony import */ var _region_map_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./region_map_types */ "./public/common/types/region_map_types.ts");
/* empty/unused harmony star reexport *//* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layer */ "./public/common/types/layer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LayerTypes", function() { return _layer__WEBPACK_IMPORTED_MODULE_3__["LayerTypes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_MAP_EXPLORER_VIS_PARAMS", function() { return _layer__WEBPACK_IMPORTED_MODULE_3__["DEFAULT_MAP_EXPLORER_VIS_PARAMS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_NEW_LAYER_OPTIONS", function() { return _layer__WEBPACK_IMPORTED_MODULE_3__["DEFAULT_NEW_LAYER_OPTIONS"]; });

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

/**
 * Use * syntax so that these exports do not break when internal
 * types are stripped.
 */





/***/ }),

/***/ "./public/common/types/layer.ts":
/*!**************************************!*\
  !*** ./public/common/types/layer.ts ***!
  \**************************************/
/*! exports provided: LayerTypes, DEFAULT_MAP_EXPLORER_VIS_PARAMS, DEFAULT_NEW_LAYER_OPTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayerTypes", function() { return LayerTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_MAP_EXPLORER_VIS_PARAMS", function() { return DEFAULT_MAP_EXPLORER_VIS_PARAMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_NEW_LAYER_OPTIONS", function() { return DEFAULT_NEW_LAYER_OPTIONS; });
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @osd/i18n */ "@osd/i18n");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants_option__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/option */ "./public/common/constants/option.ts");
/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */


/**
 * Options which each layer included
 * Each layers hava options: id, name and layerTypes
 */

;
/**
 * Specific layer options for different layer type
 */

/**
 * LayerTypes which users can choose for every layer
 */
let LayerTypes;

(function (LayerTypes) {
  LayerTypes["TMSLayer"] = "tms_layer";
  LayerTypes["WMSLayer"] = "wms_layer";
  LayerTypes["GeohashLayer"] = "geohash_layer";
})(LayerTypes || (LayerTypes = {}));

const DEFAULT_MAP_EXPLORER_VIS_PARAMS = {
  layersOptions: {
    base_roadmap: {
      id: "base_roadmap",
      name: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('visTypeMapsExplorerDashboards.defaultLayerName', {
        defaultMessage: 'Base Road Map'
      }),
      layerType: LayerTypes.TMSLayer,
      isDesatured: false,
      isHidden: false,
      minZoom: _constants_option__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CONFIGURATION_MINZOOM"],
      maxZoom: _constants_option__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CONFIGURATION_MAXZOOM"],
      typeOptions: {}
    }
  },
  layerIdOrder: ["base_roadmap"]
};
const DEFAULT_NEW_LAYER_OPTIONS = {
  id: "new_layer",
  name: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('layers.defaultNewLayerOptions.name', {
    defaultMessage: 'New Layer'
  }),
  isDesatured: false,
  typeOptions: {},
  isHidden: false,
  minZoom: _constants_option__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CONFIGURATION_MINZOOM"],
  maxZoom: _constants_option__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_CONFIGURATION_MAXZOOM"]
};

/***/ }),

/***/ "./public/common/types/map_types.ts":
/*!******************************************!*\
  !*** ./public/common/types/map_types.ts ***!
  \******************************************/
/*! exports provided: MapTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapTypes", function() { return MapTypes; });
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
let MapTypes;

(function (MapTypes) {
  MapTypes["ScaledCircleMarkers"] = "Scaled Circle Markers";
  MapTypes["ShadedCircleMarkers"] = "Shaded Circle Markers";
  MapTypes["ShadedGeohashGrid"] = "Shaded Geohash Grid";
  MapTypes["Heatmap"] = "Heatmap";
})(MapTypes || (MapTypes = {}));

/***/ }),

/***/ "./public/common/types/region_map_types.ts":
/*!*************************************************!*\
  !*** ./public/common/types/region_map_types.ts ***!
  \*************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./public/components/maps_explorer_editor_controller.tsx":
/*!***************************************************************!*\
  !*** ./public/components/maps_explorer_editor_controller.tsx ***!
  \***************************************************************/
/*! exports provided: MapsExplorerEditorController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapsExplorerEditorController", function() { return MapsExplorerEditorController; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




const MapsExplorerEditor = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_0__["lazy"])(() => Promise.all(/*! import() */[__webpack_require__.e(1), __webpack_require__.e(2)]).then(__webpack_require__.bind(null, /*! ./maps_explorer_editor */ "./public/components/maps_explorer_editor.tsx")));

class MapsExplorerEditorController {
  constructor(el, vis, eventEmitter, embeddableHandler) {
    this.el = el;
    this.vis = vis;
    this.eventEmitter = eventEmitter;
    this.embeddableHandler = embeddableHandler;
  }

  render(props) {
    Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["render"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiErrorBoundary"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Suspense"], {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          display: 'flex',
          flex: '1 1 auto',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_2__["EuiLoadingChart"], {
        size: "xl",
        mono: true
      }))
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MapsExplorerEditor, _extends({
      eventEmitter: this.eventEmitter,
      embeddableHandler: this.embeddableHandler,
      vis: this.vis
    }, props)))), this.el);
  }

  destroy() {
    Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["unmountComponentAtNode"])(this.el);
  }

}



/***/ }),

/***/ "./public/get_service_settings.ts":
/*!****************************************!*\
  !*** ./public/get_service_settings.ts ***!
  \****************************************/
/*! exports provided: getServiceSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceSettings", function() { return getServiceSettings; });
/* harmony import */ var _lazy_load_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lazy_load_bundle */ "./public/lazy_load_bundle/index.ts");
/* harmony import */ var _maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./maps_explorer_dashboards_services */ "./public/maps_explorer_dashboards_services.ts");
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


let loadPromise;
async function getServiceSettings() {
  if (typeof loadPromise !== 'undefined') {
    return loadPromise;
  }

  loadPromise = new Promise(async resolve => {
    const modules = await Object(_lazy_load_bundle__WEBPACK_IMPORTED_MODULE_0__["lazyLoadMapsExplorerDashboardsModules"])();
    const config = Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["getMapsExplorerDashboardsConfig"])(); // @ts-expect-error

    resolve(new modules.ServiceSettings(config, config.tilemap));
  });
  return loadPromise;
}

/***/ }),

/***/ "./public/index.scss":
/*!***************************!*\
  !*** ./public/index.scss ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


switch (window.__osdThemeTag__) {
  case 'v7dark':
    return __webpack_require__(/*! ./index.scss?v7dark */ "./public/index.scss?v7dark");

  case 'v7light':
    return __webpack_require__(/*! ./index.scss?v7light */ "./public/index.scss?v7light");

  case 'v8dark':
    console.error(new Error("SASS files in [mapsExplorerDashboards] were not built for theme [v8dark]. Styles were compiled using the [v7dark] theme instead to keep OpenSearch Dashboards somewhat usable. Please adjust the advanced settings to make use of [v7dark,v7light] or make sure the OSD_OPTIMIZER_THEMES environment variable includes [v8dark] in a comma separated list of themes you want to compile. You can also set it to \"*\" to build all themes."));
    return __webpack_require__(/*! ./index.scss?v7dark */ "./public/index.scss?v7dark")

  case 'v8light':
    console.error(new Error("SASS files in [mapsExplorerDashboards] were not built for theme [v8light]. Styles were compiled using the [v7light] theme instead to keep OpenSearch Dashboards somewhat usable. Please adjust the advanced settings to make use of [v7dark,v7light] or make sure the OSD_OPTIMIZER_THEMES environment variable includes [v8light] in a comma separated list of themes you want to compile. You can also set it to \"*\" to build all themes."));
    return __webpack_require__(/*! ./index.scss?v7light */ "./public/index.scss?v7light")
}

/***/ }),

/***/ "./public/index.scss?v7dark":
/*!**********************************!*\
  !*** ./public/index.scss?v7dark ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-0-1!../../../node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-0-2!../../../node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-0-3!./index.scss?v7dark */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/index.scss?v7dark");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./public/index.scss?v7light":
/*!***********************************!*\
  !*** ./public/index.scss?v7light ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-1-2!../../../node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-1-3!./index.scss?v7light */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/index.scss?v7light");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./public/index.ts":
/*!*************************!*\
  !*** ./public/index.ts ***!
  \*************************/
/*! exports provided: getPrecision, geoContains, colorUtil, convertToGeoJson, IServiceSettings, OpenSearchDashboardsMapLayer, VectorLayer, FileLayerField, FileLayer, TmsLayer, mapTooltipProvider, MapTypes, LayerTypes, DEFAULT_MAP_EXPLORER_VIS_PARAMS, DEFAULT_NEW_LAYER_OPTIONS, ORIGIN, lazyLoadMapsExplorerDashboardsModules, plugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "plugin", function() { return plugin; });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./public/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _plugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugin */ "./public/plugin.ts");
/* harmony import */ var _map_color_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map/color_util */ "./public/map/color_util.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "colorUtil", function() { return _map_color_util__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var _map_layer_opensearch_dashboards_map_layer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map/layer/opensearch_dashboards_map_layer */ "./public/map/layer/opensearch_dashboards_map_layer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OpenSearchDashboardsMapLayer", function() { return _map_layer_opensearch_dashboards_map_layer__WEBPACK_IMPORTED_MODULE_3__["OpenSearchDashboardsMapLayer"]; });

/* harmony import */ var _map_convert_to_geojson__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./map/convert_to_geojson */ "./public/map/convert_to_geojson.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "convertToGeoJson", function() { return _map_convert_to_geojson__WEBPACK_IMPORTED_MODULE_4__["convertToGeoJson"]; });

/* harmony import */ var _map_decode_geo_hash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./map/decode_geo_hash */ "./public/map/decode_geo_hash.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getPrecision", function() { return _map_decode_geo_hash__WEBPACK_IMPORTED_MODULE_5__["getPrecision"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "geoContains", function() { return _map_decode_geo_hash__WEBPACK_IMPORTED_MODULE_5__["geoContains"]; });

/* harmony import */ var _map_service_settings_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./map/service_settings_types */ "./public/map/service_settings_types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IServiceSettings", function() { return _map_service_settings_types__WEBPACK_IMPORTED_MODULE_6__["IServiceSettings"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VectorLayer", function() { return _map_service_settings_types__WEBPACK_IMPORTED_MODULE_6__["VectorLayer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FileLayerField", function() { return _map_service_settings_types__WEBPACK_IMPORTED_MODULE_6__["FileLayerField"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FileLayer", function() { return _map_service_settings_types__WEBPACK_IMPORTED_MODULE_6__["FileLayer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TmsLayer", function() { return _map_service_settings_types__WEBPACK_IMPORTED_MODULE_6__["TmsLayer"]; });

/* harmony import */ var _tooltip_provider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tooltip_provider */ "./public/tooltip_provider.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mapTooltipProvider", function() { return _tooltip_provider__WEBPACK_IMPORTED_MODULE_7__["mapTooltipProvider"]; });

/* harmony import */ var _map_index_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./map/index.scss */ "./public/map/index.scss");
/* harmony import */ var _map_index_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_map_index_scss__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/types */ "./public/common/types/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MapTypes", function() { return _common_types__WEBPACK_IMPORTED_MODULE_9__["MapTypes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LayerTypes", function() { return _common_types__WEBPACK_IMPORTED_MODULE_9__["LayerTypes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_MAP_EXPLORER_VIS_PARAMS", function() { return _common_types__WEBPACK_IMPORTED_MODULE_9__["DEFAULT_MAP_EXPLORER_VIS_PARAMS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_NEW_LAYER_OPTIONS", function() { return _common_types__WEBPACK_IMPORTED_MODULE_9__["DEFAULT_NEW_LAYER_OPTIONS"]; });

/* harmony import */ var _common_constants_origin__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/constants/origin */ "./public/common/constants/origin.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ORIGIN", function() { return _common_constants_origin__WEBPACK_IMPORTED_MODULE_10__["ORIGIN"]; });

/* harmony import */ var _lazy_load_bundle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./lazy_load_bundle */ "./public/lazy_load_bundle/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "lazyLoadMapsExplorerDashboardsModules", function() { return _lazy_load_bundle__WEBPACK_IMPORTED_MODULE_11__["lazyLoadMapsExplorerDashboardsModules"]; });


 // @ts-ignore

// @ts-ignore
 // @ts-ignore

 // @ts-ignore

 // @ts-ignore


 // @ts-ignore



/** @public */




 // This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

function plugin(initializerContext) {
  return new _plugin__WEBPACK_IMPORTED_MODULE_1__["MapsExplorerDashboardsPlugin"](initializerContext);
}

/***/ }),

/***/ "./public/lazy_load_bundle/index.ts":
/*!******************************************!*\
  !*** ./public/lazy_load_bundle/index.ts ***!
  \******************************************/
/*! exports provided: lazyLoadMapsExplorerDashboardsModules */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lazyLoadMapsExplorerDashboardsModules", function() { return lazyLoadMapsExplorerDashboardsModules; });
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
let loadModulesPromise;
async function lazyLoadMapsExplorerDashboardsModules() {
  if (typeof loadModulesPromise !== 'undefined') {
    return loadModulesPromise;
  }

  loadModulesPromise = new Promise(async resolve => {
    const {
      OpenSearchDashboardsMap,
      L,
      ServiceSettings
    } = await Promise.all(/*! import() */[__webpack_require__.e(0), __webpack_require__.e(3)]).then(__webpack_require__.bind(null, /*! ./lazy */ "./public/lazy_load_bundle/lazy/index.ts"));
    resolve({
      OpenSearchDashboardsMap,
      L,
      ServiceSettings
    });
  });
  return loadModulesPromise;
}

/***/ }),

/***/ "./public/map/base_maps_visualization.js":
/*!***********************************************!*\
  !*** ./public/map/base_maps_visualization.js ***!
  \***********************************************/
/*! exports provided: BaseMapsVisualizationProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseMapsVisualizationProvider", function() { return BaseMapsVisualizationProvider; });
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @osd/i18n */ "@osd/i18n");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../maps_explorer_dashboards_services */ "./public/maps_explorer_dashboards_services.ts");
/* harmony import */ var _lazy_load_bundle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lazy_load_bundle */ "./public/lazy_load_bundle/index.ts");
/* harmony import */ var _get_service_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../get_service_settings */ "./public/get_service_settings.ts");
/* harmony import */ var _common_types_layer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/types/layer */ "./public/common/types/layer.ts");
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





const DEFAULT_MINZOOM = 0;
const DEFAULT_MAXZOOM = 22; //increase this to 22. Better for WMS

function BaseMapsVisualizationProvider() {
  /**
   * Abstract base class for a visualization consisting of a map with a openSearchDashboardsMapLayer.
   * @class BaseMapsVisualization
   * @constructor
   */
  return class BaseMapsVisualization {
    constructor(element, vis) {
      this.vis = vis;
      this._container = element;
      this._opensearchDashboardsMap = null;
      this._chartData = null; //reference to data currently on the map.

      this._mapIsLoaded = this._makeOpenSearchDashboardsMap(); // layer id : openSearchDashboards map layer

      this._layers = {};
    }

    isLoaded() {
      return this._mapIsLoaded;
    }

    destroy() {
      if (this._opensearchDashboardsMap) {
        this._opensearchDashboardsMap.destroy();

        this._opensearchDashboardsMap = null;
      }
    }
    /**
     * Implementation of Visualization#render.
     * Child-classes can extend this method if the render-complete function requires more time until rendering has completed.
     * @param opensearchResponse
     * @param status
     * @return {Promise}
     */


    async render(opensearchResponse, visParams) {
      if (!this._opensearchDashboardsMap) {
        //the visualization has been destroyed;
        return;
      }

      await this._mapIsLoaded;

      this._opensearchDashboardsMap.resize();

      this._params = visParams;
      await this._updateParams();

      if (this._hasOpenSearchResponseChanged(opensearchResponse)) {
        await this._updateData(opensearchResponse);
      }

      this._opensearchDashboardsMap.useUiStateFromVisualization(this.vis);

      await this._updateLayers();
    }
    /**
     * Creates an instance of a opensearch-dashboards-map with a openSearchDashboardsMapLayer and assigns it to the this._opensearchDashboardsMap property.
     * Clients can override this method to customize the initialization.
     * @private
     */


    async _makeOpenSearchDashboardsMap() {
      const options = {};
      const uiState = this.vis.getUiState();
      const zoomFromUiState = parseInt(uiState.get('mapZoom'));
      const centerFromUIState = uiState.get('mapCenter');
      options.zoom = !isNaN(zoomFromUiState) ? zoomFromUiState : this.vis.params.mapZoom;
      options.center = centerFromUIState ? centerFromUIState : this.vis.params.mapCenter;
      const modules = await Object(_lazy_load_bundle__WEBPACK_IMPORTED_MODULE_2__["lazyLoadMapsExplorerDashboardsModules"])();
      this.L = modules.L;
      this._opensearchDashboardsMap = new modules.OpenSearchDashboardsMap(this._container, options);

      this._opensearchDashboardsMap.setMinZoom(DEFAULT_MINZOOM); //use a default


      this._opensearchDashboardsMap.setMaxZoom(DEFAULT_MAXZOOM); //use a default


      this._opensearchDashboardsMap.addLegendControl();

      this._opensearchDashboardsMap.addFitControl();

      this._opensearchDashboardsMap.persistUiStateForVisualization(this.vis);

      await this._updateLayers();
    }
    /**
     * Update layers with new params
     */


    async _updateLayers() {
      const {
        layersOptions,
        layerIdOrder
      } = this._getMapsParams(); // remove the deleted and hidden layers 


      for (let layerId in this._layers) {
        if (layerIdOrder.find(id => {
          return id === layerId;
        }) === undefined || layersOptions[layerId].isHidden === true) {
          this._opensearchDashboardsMap.removeLayer(this._layers[layerId]);

          delete this._layers[layerId];
        }
      }

      for (const id of layerIdOrder) {
        const layerOptions = layersOptions[id];

        if (layerOptions.isHidden) {
          continue;
        }

        if (!this._layers[id]) {
          let newLayer = null;

          switch (layerOptions.layerType) {
            case _common_types_layer__WEBPACK_IMPORTED_MODULE_4__["LayerTypes"].TMSLayer:
              newLayer = await this._createTmsLayer(layerOptions);
              break;

            case _common_types_layer__WEBPACK_IMPORTED_MODULE_4__["LayerTypes"].WMSLayer:
              newLayer = await this._createWmsLayer(layerOptions);
              break;

            default:
              throw new Error(_osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('mapExplorerDashboard.layerType.unsupportedErrorMessage', {
                defaultMessage: '{layerType} layer type not recognized',
                values: {
                  layerType: layerOptions.layerType
                }
              }));
          }

          if (newLayer) {
            await newLayer.updateOptions(layerOptions).then(() => {
              this._opensearchDashboardsMap.addLayer(newLayer);

              this._layers[id] = newLayer;
            });
          }
        } else {
          await this._layers[id].updateOptions(layerOptions);
        }

        this._layers[id].bringToFront();
      }
    }

    async _createTmsLayer(newOptions) {
      const {
        TMSLayer
      } = await __webpack_require__.e(/*! import() */ 4).then(__webpack_require__.bind(null, /*! ./layer/tms_layer/tms_layer */ "./public/map/layer/tms_layer/tms_layer.ts"));
      const tmsLayer = new TMSLayer(newOptions, this._opensearchDashboardsMap, this.L);
      return tmsLayer;
    }

    async _createWmsLayer(newOptions) {
      const {
        WMSLayer
      } = await __webpack_require__.e(/*! import() */ 5).then(__webpack_require__.bind(null, /*! ./layer/wms_layer/wms_layer */ "./public/map/layer/wms_layer/wms_layer.ts"));
      const wmsLayer = new WMSLayer(newOptions, this._opensearchDashboardsMap, this.L);
      return wmsLayer;
    }

    async _updateData() {// TODO: remove the error and implement _updateData() in base_map_visualization 
      // throw new Error(
      //   i18n.translate('maps_legacy.baseMapsVisualization.childShouldImplementMethodErrorMessage', {
      //     defaultMessage: 'Child should implement this method to respond to data-update',
      //   })
      // );
    }

    _hasOpenSearchResponseChanged(data) {
      return this._chartData !== data;
    }
    /**
     * called on options change (vis.params change)
     */


    async _updateParams() {
      const mapParams = this._getMapsParams(); // this._opensearchDashboardsMap.setLegendPosition(mapParams.legendPosition);


      this._opensearchDashboardsMap.setShowTooltip(mapParams.addTooltip);

      this._opensearchDashboardsMap.useUiStateFromVisualization(this.vis);
    }

    _getMapsParams() {
      return { ..._common_types_layer__WEBPACK_IMPORTED_MODULE_4__["DEFAULT_MAP_EXPLORER_VIS_PARAMS"],
        type: this.vis.type.name,
        ...this._params
      };
    }

  };
}

/***/ }),

/***/ "./public/map/color_util.js":
/*!**********************************!*\
  !*** ./public/map/color_util.js ***!
  \**********************************/
/*! exports provided: getLegendColors, getColor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLegendColors", function() { return getLegendColors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getColor", function() { return getColor; });
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
function getLegendColors(colorRamp) {
  let numLegendColors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  const colors = [];
  colors[0] = getColor(colorRamp, 0);

  for (let i = 1; i < numLegendColors - 1; i++) {
    colors[i] = getColor(colorRamp, Math.floor(colorRamp.length * i / numLegendColors));
  }

  colors[numLegendColors - 1] = getColor(colorRamp, colorRamp.length - 1);
  return colors;
}
function getColor(colorRamp, i) {
  const color = colorRamp[i][1];
  const red = Math.floor(color[0] * 255);
  const green = Math.floor(color[1] * 255);
  const blue = Math.floor(color[2] * 255);
  return `rgb(${red},${green},${blue})`;
}

/***/ }),

/***/ "./public/map/convert_to_geojson.js":
/*!******************************************!*\
  !*** ./public/map/convert_to_geojson.js ***!
  \******************************************/
/*! exports provided: convertToGeoJson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertToGeoJson", function() { return convertToGeoJson; });
/* harmony import */ var _decode_geo_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./decode_geo_hash */ "./public/map/decode_geo_hash.ts");
/* harmony import */ var _grid_dimensions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid_dimensions */ "./public/map/grid_dimensions.js");
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


function convertToGeoJson(tabifiedResponse, _ref) {
  let {
    geohash,
    geocentroid,
    metric
  } = _ref;
  let features;
  let min = Infinity;
  let max = -Infinity;

  if (tabifiedResponse && tabifiedResponse.rows) {
    const table = tabifiedResponse;
    const geohashColumn = geohash ? table.columns[geohash.accessor] : null;

    if (!geohashColumn) {
      features = [];
    } else {
      const metricColumn = table.columns[metric.accessor];
      const geocentroidColumn = geocentroid ? table.columns[geocentroid.accessor] : null;
      features = table.rows.map(row => {
        const geohashValue = row[geohashColumn.id];
        if (!geohashValue) return false;
        const geohashLocation = Object(_decode_geo_hash__WEBPACK_IMPORTED_MODULE_0__["decodeGeoHash"])(geohashValue);
        let pointCoordinates;

        if (geocentroidColumn) {
          const location = row[geocentroidColumn.id];
          pointCoordinates = [location.lon, location.lat];
        } else {
          pointCoordinates = [geohashLocation.longitude[2], geohashLocation.latitude[2]];
        }

        const rectangle = [[geohashLocation.latitude[0], geohashLocation.longitude[0]], [geohashLocation.latitude[0], geohashLocation.longitude[1]], [geohashLocation.latitude[1], geohashLocation.longitude[1]], [geohashLocation.latitude[1], geohashLocation.longitude[0]]];
        const centerLatLng = [geohashLocation.latitude[2], geohashLocation.longitude[2]];

        if (geohash.params.useGeocentroid) {
          // see https://github.com/elastic/elasticsearch/issues/24694 for why clampGrid is used
          pointCoordinates[0] = clampGrid(pointCoordinates[0], geohashLocation.longitude[0], geohashLocation.longitude[1]);
          pointCoordinates[1] = clampGrid(pointCoordinates[1], geohashLocation.latitude[0], geohashLocation.latitude[1]);
        }

        const value = row[metricColumn.id];
        min = Math.min(min, value);
        max = Math.max(max, value);
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: pointCoordinates
          },
          properties: {
            geohash: geohashValue,
            geohash_meta: {
              center: centerLatLng,
              rectangle: rectangle
            },
            value: value
          }
        };
      }).filter(row => row);
    }
  } else {
    features = [];
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features: features
  };
  return {
    featureCollection: featureCollection,
    meta: {
      min: min,
      max: max,
      geohashPrecision: geohash && geohash.params.precision,
      geohashGridDimensionsAtEquator: geohash && Object(_grid_dimensions__WEBPACK_IMPORTED_MODULE_1__["gridDimensions"])(geohash.params.precision)
    }
  };
}

function clampGrid(val, min, max) {
  if (val > max) val = max;else if (val < min) val = min;
  return val;
}

/***/ }),

/***/ "./public/map/decode_geo_hash.ts":
/*!***************************************!*\
  !*** ./public/map/decode_geo_hash.ts ***!
  \***************************************/
/*! exports provided: decodeGeoHash, geohashColumns, geoContains */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeGeoHash", function() { return decodeGeoHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geohashColumns", function() { return geohashColumns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geoContains", function() { return geoContains; });
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

/**
 * Decodes geohash to object containing
 * top-left and bottom-right corners of
 * rectangle and center point.
 */
function decodeGeoHash(geohash) {
  const BITS = [16, 8, 4, 2, 1];
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let isEven = true;
  const lat = [];
  const lon = [];
  lat[0] = -90.0;
  lat[1] = 90.0;
  lon[0] = -180.0;
  lon[1] = 180.0;
  let latErr = 90.0;
  let lonErr = 180.0;
  [...geohash].forEach(nextChar => {
    const cd = BASE32.indexOf(nextChar);

    for (let j = 0; j < 5; j++) {
      const mask = BITS[j];

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
  return {
    latitude: lat,
    longitude: lon
  };
}

function refineInterval(interval, cd, mask) {
  if (cd & mask) {
    /* eslint-disable-line */
    interval[0] = (interval[0] + interval[1]) / 2;
  } else {
    interval[1] = (interval[0] + interval[1]) / 2;
  }
}

function geohashColumns(precision) {
  return geohashCells(precision, 0);
}
/**
 * Get the number of geohash cells for a given precision
 *
 * @param {number} precision the geohash precision (1<=precision<=12).
 * @param {number} axis constant for the axis 0=lengthwise (ie. columns, along longitude), 1=heightwise (ie. rows, along latitude).
 * @returns {number} Number of geohash cells (rows or columns) at that precision
 */

function geohashCells(precision, axis) {
  let cells = 1;

  for (let i = 1; i <= precision; i += 1) {
    /* On odd precisions, rows divide by 4 and columns by 8. Vice-versa on even precisions */
    cells *= i % 2 === axis ? 4 : 8;
  }

  return cells;
}

function geoContains(collar, bounds) {
  if (!bounds || !collar) return false; // test if bounds top_left is outside collar

  if (bounds.top_left.lat > collar.top_left.lat || bounds.top_left.lon < collar.top_left.lon) {
    return false;
  } // test if bounds bottom_right is outside collar


  if (bounds.bottom_right.lat < collar.bottom_right.lat || bounds.bottom_right.lon > collar.bottom_right.lon) {
    return false;
  } // both corners are inside collar so collar contains bounds


  return true;
}

/***/ }),

/***/ "./public/map/grid_dimensions.js":
/*!***************************************!*\
  !*** ./public/map/grid_dimensions.js ***!
  \***************************************/
/*! exports provided: gridDimensions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gridDimensions", function() { return gridDimensions; });
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
// geohash precision mapping of geohash grid cell dimensions (width x height, in meters) at equator.
// https://opensearch.org/docs/latest/opensearch/bucket-agg/#geo_distance-geohash_grid
const gridAtEquator = {
  1: [5009400, 4992600],
  2: [1252300, 624100],
  3: [156500, 156000],
  4: [39100, 19500],
  5: [4900, 4900],
  6: [1200, 609.4],
  7: [152.9, 152.4],
  8: [38.2, 19],
  9: [4.8, 4.8],
  10: [1.2, 0.595],
  11: [0.149, 0.149],
  12: [0.037, 0.019]
};
function gridDimensions(precision) {
  return gridAtEquator[precision];
}

/***/ }),

/***/ "./public/map/index.scss":
/*!*******************************!*\
  !*** ./public/map/index.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


switch (window.__osdThemeTag__) {
  case 'v7dark':
    return __webpack_require__(/*! ./index.scss?v7dark */ "./public/map/index.scss?v7dark");

  case 'v7light':
    return __webpack_require__(/*! ./index.scss?v7light */ "./public/map/index.scss?v7light");

  case 'v8dark':
    console.error(new Error("SASS files in [mapsExplorerDashboards] were not built for theme [v8dark]. Styles were compiled using the [v7dark] theme instead to keep OpenSearch Dashboards somewhat usable. Please adjust the advanced settings to make use of [v7dark,v7light] or make sure the OSD_OPTIMIZER_THEMES environment variable includes [v8dark] in a comma separated list of themes you want to compile. You can also set it to \"*\" to build all themes."));
    return __webpack_require__(/*! ./index.scss?v7dark */ "./public/map/index.scss?v7dark")

  case 'v8light':
    console.error(new Error("SASS files in [mapsExplorerDashboards] were not built for theme [v8light]. Styles were compiled using the [v7light] theme instead to keep OpenSearch Dashboards somewhat usable. Please adjust the advanced settings to make use of [v7dark,v7light] or make sure the OSD_OPTIMIZER_THEMES environment variable includes [v8light] in a comma separated list of themes you want to compile. You can also set it to \"*\" to build all themes."));
    return __webpack_require__(/*! ./index.scss?v7light */ "./public/map/index.scss?v7light")
}

/***/ }),

/***/ "./public/map/index.scss?v7dark":
/*!**************************************!*\
  !*** ./public/map/index.scss?v7dark ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-0-1!../../../../node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-0-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-0-3!./index.scss?v7dark */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/map/index.scss?v7dark");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./public/map/index.scss?v7light":
/*!***************************************!*\
  !*** ./public/map/index.scss?v7light ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../node_modules/postcss-loader/dist/cjs.js??ref--6-oneOf-1-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--6-oneOf-1-3!./index.scss?v7light */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/dist/cjs.js?!../../node_modules/sass-loader/dist/cjs.js?!./public/map/index.scss?v7light");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./public/map/layer/opensearch_dashboards_map_layer.ts":
/*!*************************************************************!*\
  !*** ./public/map/layer/opensearch_dashboards_map_layer.ts ***!
  \*************************************************************/
/*! exports provided: OpenSearchDashboardsMapLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OpenSearchDashboardsMapLayer", function() { return OpenSearchDashboardsMapLayer; });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "../../node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
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

class OpenSearchDashboardsMapLayer extends events__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"] {
  constructor(opensearchDashboardsMap, options) {
    super();

    _defineProperty(this, "_leafletLayer", void 0);

    _defineProperty(this, "_attribution", void 0);

    _defineProperty(this, "_options", void 0);

    _defineProperty(this, "_opensearchDashboardsMap", void 0);

    this._leafletLayer = null;
    this._options = options;
    this._opensearchDashboardsMap = opensearchDashboardsMap;
  }

  async getBounds() {
    return this._leafletLayer.getBounds();
  }

  addToLeafletMap(leafletMap) {
    this._leafletLayer.addTo(leafletMap);
  }

  removeFromLeafletMap(leafletMap) {
    leafletMap.removeLayer(this._leafletLayer);
  }

  async createLeafletLayer() {}

  appendLegendContents() {}

  updateExtent() {}

  movePointer() {}

  getAttributions() {
    return this._attribution;
  }
  /**
   * Update the layer's desaturated status
   * @param isDesaturated 
   * @returns 
   */


  setDesaturate(isDesaturated) {}
  /**
   * Check whether the new optoin requires a re-creation of the layer,
   * if true, opensearch dashboard map will not re-create the layer,
   * otherwise, opensearch dashboard map will re-create the layer.
   * @param option The option that is specific for the layer
   * @returns 
   */


  isReusable(option) {
    return this._options.minZoom === option.minZoom && this._options.maxZoom === option.maxZoom;
  }
  /**
   * The function allows layer to modify options if necessary.
   * @param options the original options
   * @returns options that has been decorated
   */


  async decorateOptions(options) {
    return options;
  }
  /**
   * Update layer's options
   * @param options The option that is specific for the layer
   */


  async updateOptions(options) {
    const newOptions = await this.decorateOptions(options);

    if (this._leafletLayer === null || !this.isReusable(newOptions)) {
      this._options = newOptions;

      if (this._leafletLayer !== null) {
        this.removeFromLeafletMap(this._opensearchDashboardsMap._leafletMap);
      }

      this._leafletLayer = await this.createLeafletLayer();
      this.addToLeafletMap(this._opensearchDashboardsMap._leafletMap);
    } else {
      this._options = newOptions;
    }

    this.emit('layer:update');
  }

  getOptions() {
    return this._options;
  }

  bringToFront() {
    this._leafletLayer.bringToFront();
  }

}

/***/ }),

/***/ "./public/map/service_settings_types.ts":
/*!**********************************************!*\
  !*** ./public/map/service_settings_types.ts ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./public/maps_explorer_dashboards_fn.ts":
/*!***********************************************!*\
  !*** ./public/maps_explorer_dashboards_fn.ts ***!
  \***********************************************/
/*! exports provided: createMapsExplorerDashboardsFn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMapsExplorerDashboardsFn", function() { return createMapsExplorerDashboardsFn; });
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @osd/i18n */ "@osd/i18n");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./public/index.ts");


const createMapsExplorerDashboardsFn = () => ({
  name: 'maps_explorer_dashboards',
  type: 'render',
  context: {
    types: ['opensearch_dashboards_datatable']
  },
  //TODO: update the string ID
  help: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('mapsExplorerDashboards.function.help', {
    defaultMessage: 'Maps Explorer Dashboards visualization'
  }),
  args: {
    visConfig: {
      types: ['string'],
      default: '"{}"',
      help: ''
    }
  },

  fn(context, args) {
    const visConfig = JSON.parse(args.visConfig);
    const {
      geohash,
      metric,
      geocentroid
    } = visConfig.dimensions;
    const convertedData = Object(___WEBPACK_IMPORTED_MODULE_1__["convertToGeoJson"])(context, {
      geohash,
      metric,
      geocentroid
    });

    if (geohash && geohash.accessor) {
      convertedData.meta.geohash = context.columns[geohash.accessor].meta;
    }

    return {
      type: 'render',
      as: 'visualization',
      value: {
        visData: convertedData,
        visType: 'maps_explorer_dashboards',
        visConfig,
        params: {
          listenOnChange: true
        }
      }
    };
  }

});

/***/ }),

/***/ "./public/maps_explorer_dashboards_services.ts":
/*!*****************************************************!*\
  !*** ./public/maps_explorer_dashboards_services.ts ***!
  \*****************************************************/
/*! exports provided: setToasts, getToasts, setUiSettings, getUiSettings, setOpenSearchDashboardsVersion, getOpenSearchDashboardsVersion, setMapsExplorerDashboardsConfig, getMapsExplorerDashboardsConfig, getEmsTileLayerId, getCoreService, setCoreService, getFormatService, setFormatService, getNotifications, setNotifications, getQueryService, setQueryService, getShareService, setShareService, getOpenSearchDashboardsLegacy, setOpenSearchDashboardsLegacy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setToasts", function() { return setToasts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getToasts", function() { return getToasts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUiSettings", function() { return setUiSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUiSettings", function() { return getUiSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setOpenSearchDashboardsVersion", function() { return setOpenSearchDashboardsVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOpenSearchDashboardsVersion", function() { return getOpenSearchDashboardsVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setMapsExplorerDashboardsConfig", function() { return setMapsExplorerDashboardsConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMapsExplorerDashboardsConfig", function() { return getMapsExplorerDashboardsConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEmsTileLayerId", function() { return getEmsTileLayerId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCoreService", function() { return getCoreService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCoreService", function() { return setCoreService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFormatService", function() { return getFormatService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setFormatService", function() { return setFormatService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNotifications", function() { return getNotifications; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setNotifications", function() { return setNotifications; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getQueryService", function() { return getQueryService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setQueryService", function() { return setQueryService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getShareService", function() { return getShareService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setShareService", function() { return setShareService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOpenSearchDashboardsLegacy", function() { return getOpenSearchDashboardsLegacy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setOpenSearchDashboardsLegacy", function() { return setOpenSearchDashboardsLegacy; });
/* harmony import */ var _src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/plugins/opensearch_dashboards_utils/public */ "plugin/opensearchDashboardsUtils/public");
/* harmony import */ var _src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__);
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

// Maps Legacy Related
let toast;
const setToasts = notificationToast => toast = notificationToast;
const getToasts = () => toast;
let uiSettings;
const setUiSettings = coreUiSettings => uiSettings = coreUiSettings;
const getUiSettings = () => uiSettings;
let opensearchDashboards;
const setOpenSearchDashboardsVersion = version => opensearchDashboards = version;
const getOpenSearchDashboardsVersion = () => opensearchDashboards;
let mapsExplorerDashboardsConfig;
const setMapsExplorerDashboardsConfig = config => mapsExplorerDashboardsConfig = config;
const getMapsExplorerDashboardsConfig = () => mapsExplorerDashboardsConfig;
const getEmsTileLayerId = () => getMapsExplorerDashboardsConfig().emsTileLayerId; // Tile Map Related

const [getCoreService, setCoreService] = Object(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__["createGetterSetter"])('Core');
const [getFormatService, setFormatService] = Object(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__["createGetterSetter"])('data.fieldFormats');
const [getNotifications, setNotifications] = Object(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__["createGetterSetter"])('Notifications');
const [getQueryService, setQueryService] = Object(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__["createGetterSetter"])('Query');
const [getShareService, setShareService] = Object(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__["createGetterSetter"])('Share');
const [getOpenSearchDashboardsLegacy, setOpenSearchDashboardsLegacy] = Object(_src_plugins_opensearch_dashboards_utils_public__WEBPACK_IMPORTED_MODULE_0__["createGetterSetter"])('OpenSearchDashboardsLegacy');

/***/ }),

/***/ "./public/maps_explorer_dashboards_types.tsx":
/*!***************************************************!*\
  !*** ./public/maps_explorer_dashboards_types.tsx ***!
  \***************************************************/
/*! exports provided: createMapsExplorerDashboardsVisTypeDefinition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMapsExplorerDashboardsVisTypeDefinition", function() { return createMapsExplorerDashboardsVisTypeDefinition; });
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @osd/i18n */ "@osd/i18n");
/* harmony import */ var _osd_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./public/index.ts");
/* harmony import */ var _src_plugins_charts_public__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/plugins/charts/public */ "plugin/charts/public");
/* harmony import */ var _src_plugins_charts_public__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_charts_public__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/types */ "./public/common/types/index.ts");
/* harmony import */ var _components_maps_explorer_editor_controller__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/maps_explorer_editor_controller */ "./public/components/maps_explorer_editor_controller.tsx");





const createMapsExplorerDashboardsVisTypeDefinition = dependencies => {
  const {
    uiSettings,
    getServiceSettings
  } = dependencies;
  return {
    name: 'maps_explorer_dashboards',
    // TODO: Define String ID  'visTypeMapsExplorerDashboards.mapsExplorerDashboardsTitle'
    title: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('visTypeMapsExplorerDashboards.mapsExplorerDashboardsTitle', {
      defaultMessage: 'Maps Explorer'
    }),
    // TODO: change to the unique icon later
    icon: 'visMapRegion',
    // TODO: Define String ID 'visTypeMapsExplorerDashboards.metricDescription'
    description: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('visTypeMapsExplorerDashboards.metricDescription', {
      defaultMessage: 'Add/Remove specific map layers depending on demand.'
    }),
    visualization: dependencies.BaseMapsVisualization,
    responseHandler: ___WEBPACK_IMPORTED_MODULE_1__["convertToGeoJson"],
    editor: _components_maps_explorer_editor_controller__WEBPACK_IMPORTED_MODULE_4__["MapsExplorerEditorController"],
    editorConfig: {
      collections: {
        colorSchemas: _src_plugins_charts_public__WEBPACK_IMPORTED_MODULE_2__["truncatedColorSchemas"],
        layerTypes: [{
          value: _common_types__WEBPACK_IMPORTED_MODULE_3__["LayerTypes"].TMSLayer,
          text: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('mapsExplorer.vis.editorConfig.layerTypes.tmsLayerText', {
            defaultMessage: 'TMS Layer'
          })
        }, {
          value: _common_types__WEBPACK_IMPORTED_MODULE_3__["LayerTypes"].WMSLayer,
          text: _osd_i18n__WEBPACK_IMPORTED_MODULE_0__["i18n"].translate('mapsExplorer.vis.editorConfig.layerTypes.geohashLayerText', {
            defaultMessage: 'WMS Layer'
          })
        }]
      }
    },
    setup: async vis => {
      let tmsLayers;

      try {
        const serviceSettings = await getServiceSettings();
        tmsLayers = await serviceSettings.getTMSServices();
      } catch (e) {
        return vis;
      }

      vis.type.editorConfig.collections.tmsLayers = tmsLayers;

      if (!vis.params.wms.selectedTmsLayer && tmsLayers.length) {
        vis.params.wms.selectedTmsLayer = tmsLayers[0];
      }

      return vis;
    }
  };
};

/***/ }),

/***/ "./public/plugin.ts":
/*!**************************!*\
  !*** ./public/plugin.ts ***!
  \**************************/
/*! exports provided: bindSetupCoreAndPlugins, MapsExplorerDashboardsPlugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindSetupCoreAndPlugins", function() { return bindSetupCoreAndPlugins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapsExplorerDashboardsPlugin", function() { return MapsExplorerDashboardsPlugin; });
/* harmony import */ var _maps_explorer_dashboards_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./maps_explorer_dashboards_types */ "./public/maps_explorer_dashboards_types.tsx");
/* harmony import */ var _maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./maps_explorer_dashboards_services */ "./public/maps_explorer_dashboards_services.ts");
/* harmony import */ var _maps_explorer_dashboards_fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./maps_explorer_dashboards_fn */ "./public/maps_explorer_dashboards_fn.ts");
/* harmony import */ var _map_base_maps_visualization__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map/base_maps_visualization */ "./public/map/base_maps_visualization.js");
/* harmony import */ var _get_service_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./get_service_settings */ "./public/get_service_settings.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const bindSetupCoreAndPlugins = (core, config, opensearchDashboards) => {
  Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setToasts"])(core.notifications.toasts);
  Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setUiSettings"])(core.uiSettings);
  Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setOpenSearchDashboardsVersion"])(opensearchDashboards);
  Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setMapsExplorerDashboardsConfig"])(config);
};
class MapsExplorerDashboardsPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "_initializerContext", void 0);

    this._initializerContext = initializerContext;
  }

  setup(core, _ref) {
    let {
      expressions,
      visualizations
    } = _ref;

    const config = this._initializerContext.config.get();

    const opensearchDashboards = this._initializerContext.env.packageInfo.version;
    const visualizationDependencies = {
      uiSettings: core.uiSettings,
      config: config,
      getServiceSettings: _get_service_settings__WEBPACK_IMPORTED_MODULE_4__["getServiceSettings"],
      BaseMapsVisualization: Object(_map_base_maps_visualization__WEBPACK_IMPORTED_MODULE_3__["BaseMapsVisualizationProvider"])()
    };
    bindSetupCoreAndPlugins(core, config, opensearchDashboards);
    expressions.registerFunction(() => Object(_maps_explorer_dashboards_fn__WEBPACK_IMPORTED_MODULE_2__["createMapsExplorerDashboardsFn"])());
    visualizations.createBaseVisualization(Object(_maps_explorer_dashboards_types__WEBPACK_IMPORTED_MODULE_0__["createMapsExplorerDashboardsVisTypeDefinition"])(visualizationDependencies)); // Return methods that should be available to other plugins

    return {
      config
    };
  }

  start(core, plugins) {
    Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setCoreService"])(core);
    Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setFormatService"])(plugins.data.fieldFormats);
    Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setQueryService"])(plugins.data.query);
    Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setNotifications"])(core.notifications);
    Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setOpenSearchDashboardsLegacy"])(plugins.opensearchDashboardsLegacy);
    Object(_maps_explorer_dashboards_services__WEBPACK_IMPORTED_MODULE_1__["setShareService"])(plugins.share);
    return {};
  }

  stop() {}

}

/***/ }),

/***/ "./public/tooltip_provider.js":
/*!************************************!*\
  !*** ./public/tooltip_provider.js ***!
  \************************************/
/*! exports provided: mapTooltipProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapTooltipProvider", function() { return mapTooltipProvider; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/server */ "react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_1__);
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



function getToolTipContent(details) {
  return react_dom_server__WEBPACK_IMPORTED_MODULE_1___default.a.renderToStaticMarkup( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, details.map((detail, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    key: i
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "visTooltip__label"
  }, detail.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "visTooltip__value"
  }, detail.value))))));
}

function mapTooltipProvider(element, formatter) {
  return function () {
    const details = formatter(...arguments);
    return details && getToolTipContent(details);
  };
}

/***/ }),

/***/ "@elastic/eui":
/*!***********************************************!*\
  !*** external "__osdSharedDeps__.ElasticEui" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.ElasticEui;

/***/ }),

/***/ "@osd/i18n":
/*!********************************************!*\
  !*** external "__osdSharedDeps__.OsdI18n" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.OsdI18n;

/***/ }),

/***/ "@osd/i18n/react":
/*!*************************************************!*\
  !*** external "__osdSharedDeps__.OsdI18nReact" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.OsdI18nReact;

/***/ }),

/***/ "jquery":
/*!*******************************************!*\
  !*** external "__osdSharedDeps__.Jquery" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.Jquery;

/***/ }),

/***/ "lodash":
/*!*******************************************!*\
  !*** external "__osdSharedDeps__.Lodash" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.Lodash;

/***/ }),

/***/ "plugin/charts/public":
/*!*********************************************!*\
  !*** @osd/bundleRef "plugin/charts/public" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {


      __webpack_require__.r(__webpack_exports__);
      var ns = __osdBundles__.get('plugin/charts/public');
      Object.defineProperties(__webpack_exports__, Object.getOwnPropertyDescriptors(ns))
    

/***/ }),

/***/ "plugin/opensearchDashboardsReact/public":
/*!****************************************************************!*\
  !*** @osd/bundleRef "plugin/opensearchDashboardsReact/public" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {


      __webpack_require__.r(__webpack_exports__);
      var ns = __osdBundles__.get('plugin/opensearchDashboardsReact/public');
      Object.defineProperties(__webpack_exports__, Object.getOwnPropertyDescriptors(ns))
    

/***/ }),

/***/ "plugin/opensearchDashboardsUtils/public":
/*!****************************************************************!*\
  !*** @osd/bundleRef "plugin/opensearchDashboardsUtils/public" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {


      __webpack_require__.r(__webpack_exports__);
      var ns = __osdBundles__.get('plugin/opensearchDashboardsUtils/public');
      Object.defineProperties(__webpack_exports__, Object.getOwnPropertyDescriptors(ns))
    

/***/ }),

/***/ "plugin/visDefaultEditor/public":
/*!*******************************************************!*\
  !*** @osd/bundleRef "plugin/visDefaultEditor/public" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {


      __webpack_require__.r(__webpack_exports__);
      var ns = __osdBundles__.get('plugin/visDefaultEditor/public');
      Object.defineProperties(__webpack_exports__, Object.getOwnPropertyDescriptors(ns))
    

/***/ }),

/***/ "react":
/*!******************************************!*\
  !*** external "__osdSharedDeps__.React" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.React;

/***/ }),

/***/ "react-dom":
/*!*********************************************!*\
  !*** external "__osdSharedDeps__.ReactDom" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.ReactDom;

/***/ }),

/***/ "react-dom/server":
/*!***************************************************!*\
  !*** external "__osdSharedDeps__.ReactDomServer" ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.ReactDomServer;

/***/ }),

/***/ "tslib":
/*!******************************************!*\
  !*** external "__osdSharedDeps__.TsLib" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __osdSharedDeps__.TsLib;

/***/ })

/******/ });
//# sourceMappingURL=mapsExplorerDashboards.plugin.js.map