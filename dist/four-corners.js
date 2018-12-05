(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("FourCorners", [], factory);
	else if(typeof exports === 'object')
		exports["FourCorners"] = factory();
	else
		root["FourCorners"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/styles.scss */ \"./src/styles.scss\");\n/* harmony import */ var _src_styles_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_styles_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/index.js */ \"./src/index.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_src_index_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://FourCorners/./index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar FourCorners =\n/*#__PURE__*/\nfunction () {\n  function FourCorners(embed, opts) {\n    _classCallCheck(this, FourCorners);\n\n    console.log(embed);\n    this.elems = {};\n    this.opts = opts;\n    this.corners = ['context', 'links', 'copyright', 'backstory'];\n    this.elems.embed = embed;\n    this.elems.embed.classList.add('fc-init');\n    this.data = parseData(this);\n    this.elems.photo = addPhoto(this);\n    this.elems.panels = addPanels(this);\n    this.elems.corners = addCorners(this);\n  }\n\n  _createClass(FourCorners, [{\n    key: \"init\",\n    value: function init(userOpts) {\n      var proto = this;\n      proto.embeds = [];\n      var defaultOpts = {\n        selector: '.fc-embed:not(.fc-init)',\n        cornerStroke: '6px',\n        cornerSize: '25px',\n        cornerColor: 'white',\n        cornerActiveColor: 'blue',\n        cornerHoverColor: 'red',\n        posDur: 0.2,\n        transDur: 0.1\n      };\n      var opts = Object.assign(defaultOpts, userOpts);\n      var embeds = Array.from(document.querySelectorAll(opts.selector));\n      console.log(document.querySelectorAll('.fc-embed'));\n      embeds.forEach(function (embed, i) {\n        var inst = new FourCorners(embed, opts);\n        proto.embeds.push(inst);\n      });\n      return proto.embeds;\n    }\n  }, {\n    key: \"openCorner\",\n    value: function openCorner(slug) {\n      var inst = this;\n      var corners = this.corners;\n      var embed = this.elems.embed;\n      var corner = this.elems.corners[slug];\n      var panel = this.elems.panels[slug];\n\n      if (corner && panel) {\n        embed.dataset.active = slug;\n        embed.classList.add('fc-active');\n        corner.classList.add('fc-active');\n        panel.classList.add('fc-active');\n      }\n\n      corners.forEach(function (_slug, i) {\n        if (_slug != slug) {\n          inst.closeCorner(_slug);\n        }\n      });\n    }\n  }, {\n    key: \"closeCorner\",\n    value: function closeCorner(slug) {\n      var inst = this;\n      var embed = inst.elems.embed;\n\n      if (!slug) {\n        slug = embed.dataset.active;\n      }\n\n      var corner = inst.elems.corners[slug];\n      var panel = inst.elems.panels[slug];\n\n      if (slug == embed.dataset.active) {\n        embed.dataset.active = '';\n        embed.classList.remove('fc-active');\n      }\n\n      if (corner) {\n        corner.classList.remove('fc-active');\n      }\n\n      if (panel) {\n        panel.classList.remove('fc-active');\n      }\n    }\n  }]);\n\n  return FourCorners;\n}();\n\nvar initEmbed = function initEmbed(inst) {\n  var embed = document.querySelector(inst.opts.selector);\n\n  if (!embed) {\n    return;\n  }\n\n  return embed;\n};\n\nvar addPhoto = function addPhoto(inst) {\n  var embed = inst.elems.embed;\n  var img = document.createElement('img');\n  img.classList.add('fc-img');\n  var photo = '';\n  var photoSelector = '.fc-photo';\n\n  if (!embed.querySelector(photoSelector)) {\n    photo = document.createElement('div');\n    photo.classList.add('fc-photo');\n    var pseudoImg = new Image();\n    var src = inst.data.img;\n\n    pseudoImg.onload = function (e) {\n      img.src = src;\n      photo.classList.add('fc-loaded');\n    };\n\n    pseudoImg.onerror = function (e) {\n      console.log(e);\n    };\n\n    pseudoImg.src = src;\n    photo.appendChild(img);\n  } else {\n    photo = embed.querySelector(photoSelector);\n  }\n\n  embed.appendChild(photo);\n  return photo;\n};\n\nvar addPanels = function addPanels(inst) {\n  var panels = {};\n  var embed = inst.elems.embed;\n  inst.corners.forEach(function (slug, i) {\n    var panel = '';\n    var panelSelector = '.fc-panel[data-slug=\"' + slug + '\"]';\n\n    if (!embed.querySelector(panelSelector)) {\n      panel = document.createElement('div');\n      panel.classList.add('fc-panel');\n      panel.dataset.slug = slug;\n      var panelInner = document.createElement('div');\n      panelInner.classList.add('fc-inner');\n      var panelTitle = document.createElement('div');\n      panelTitle.classList.add('fc-panel-title');\n      panelTitle.innerHTML = slug;\n      panel.appendChild(panelTitle);\n\n      if (inst.data) {\n        var data = inst.data[slug];\n        Object.entries(data).forEach(function (_ref) {\n          var _ref2 = _slicedToArray(_ref, 2),\n              prop = _ref2[0],\n              val = _ref2[1];\n\n          if (!val) {\n            return;\n          }\n\n          var row = document.createElement('div');\n          row.classList.add('fc-row', 'fc-' + prop);\n\n          if (!['media', 'links'].includes(prop)) {\n            var label = document.createElement('div');\n            label.className = 'fc-label';\n            label.innerHTML = prop;\n            row.appendChild(label);\n          }\n\n          if (prop == 'media') {\n            row.append(addMedia(val));\n          } else if (prop == 'links') {\n            row.append(addLinks(val));\n          } else {\n            val = wrapUrls(val);\n            row.innerHTML += val;\n          }\n\n          panelInner.appendChild(row);\n        });\n      }\n\n      panel.appendChild(panelInner);\n      embed.appendChild(panel);\n    } else {\n      panel = embed.querySelector(panelSelector);\n    }\n\n    panels[slug] = panel;\n  });\n  return panels;\n};\n\nvar addMedia = function addMedia(arr) {\n  var subRows = document.createElement('div');\n  subRows.className = 'fc-sub-rows';\n  arr.forEach(function (obj, index) {\n    var subRow = document.createElement('div');\n    subRow.className = 'fc-sub-row';\n\n    if (obj.type == 'image') {\n      var img = document.createElement('img');\n      img.src = obj.url;\n      subRow.appendChild(img);\n    } else {\n      getMediaEmbed(obj, subRow);\n    }\n\n    if (obj.credit) {\n      var credit = document.createElement('div');\n      credit.className = 'fc-sub-credit';\n      credit.innerHTML = obj.credit;\n      subRow.appendChild(credit);\n    }\n\n    subRows.appendChild(subRow);\n  });\n  return subRows;\n};\n\nvar getMediaEmbed = function getMediaEmbed(obj, subRow) {\n  var req = '';\n\n  switch (obj.type) {\n    case 'youtube':\n      req = 'https://www.youtube.com/oembed?url=' + obj.url;\n      break;\n\n    case 'vimeo':\n      req = 'https://vimeo.com/api/oembed.json?url=' + obj.url;\n      break;\n\n    case 'soundcloud':\n      req = 'https://soundcloud.com/oembed?format=json&url=' + obj.url;\n      break;\n\n    default:\n      return false;\n      break;\n  }\n\n  fetch(req).then(function (res) {\n    if (!res.ok) {\n      throw Error(res.statusText);\n    }\n\n    return res.json();\n  }).then(function (res) {\n    var mediaWrap = document.createElement('div');\n    mediaWrap.className = 'fc-media-wrap';\n    mediaWrap.innerHTML = res.html;\n\n    if (Number.isInteger(res.width, res.height)) {\n      var ratio = res.height / res.width;\n      mediaWrap.classList.add('fc-responsive');\n      mediaWrap.style.paddingBottom = ratio * 100 + '%';\n    }\n\n    subRow.prepend(mediaWrap);\n  }).catch(function (err) {\n    console.log(err);\n  });\n};\n\nvar addLinks = function addLinks(arr) {\n  var subRows = document.createElement('div');\n  subRows.className = 'fc-sub-rows';\n  arr.forEach(function (obj, index) {\n    var subRow = document.createElement('a');\n    subRow.className = 'fc-sub-row';\n    subRow.href = obj.url;\n    subRow.target = '_blank';\n\n    if (obj.title) {\n      var title = document.createElement('div');\n      title.className = 'fc-sub-title';\n      title.innerHTML = obj.title;\n      subRow.appendChild(title);\n    }\n\n    if (obj.url) {\n      var url = document.createElement('div');\n      url.className = 'fc-sub-url';\n      url.innerHTML = obj.url;\n      subRow.appendChild(url);\n    }\n\n    subRows.appendChild(subRow);\n  });\n  return subRows;\n};\n\nvar addCorners = function addCorners(inst) {\n  var corners = {};\n  var embed = inst.elems.embed;\n  var photo = inst.elems.photo;\n  embed.addEventListener('mouseenter', function (e) {\n    hoverEmbed(e, inst);\n  });\n  embed.addEventListener('mouseleave', function (e) {\n    unhoverEmbed(e, inst);\n  });\n\n  if (photo) {\n    photo.addEventListener('click', function (e) {\n      clickPhoto(e, inst);\n    });\n  }\n\n  inst.corners.forEach(function (slug, i) {\n    var cornerSelector = '.fc-corner[data-slug=\"' + slug + '\"]';\n\n    if (embed.querySelector(cornerSelector)) {\n      return;\n    }\n\n    var corner = document.createElement('div');\n\n    if (!corner) {\n      return;\n    }\n\n    corner.classList.add('fc-corner');\n    corner.dataset.slug = slug;\n    corner.addEventListener('mouseenter', function (e) {\n      hoverCorner(e, inst);\n    });\n    corner.addEventListener('mouseleave', function (e) {\n      unhoverCorner(e, inst);\n    });\n    corner.addEventListener('click', function (e) {\n      clickCorner(e, inst);\n    });\n    corners[slug] = corner;\n    embed.appendChild(corner);\n  });\n  return corners;\n};\n\nvar parseData = function parseData(inst) {\n  var stringData = inst.elems.embed.dataset.fc;\n\n  if (!stringData) {\n    return;\n  }\n\n  stringData = stringData;\n  delete inst.elems.embed.dataset.fc;\n  return JSON.parse(stringData);\n};\n\nvar hoverEmbed = function hoverEmbed(e, inst) {\n  var embed = inst.elems.embed;\n  var corners = inst.elems.corners;\n  var css = inst.css;\n  var posDur = inst.opts.posDur;\n};\n\nvar unhoverEmbed = function unhoverEmbed(e, inst) {\n  var embed = inst.elems.embed;\n  var corners = inst.elems.corners;\n  var css = inst.css;\n  var posDur = inst.opts.posDur;\n};\n\nvar hoverCorner = function hoverCorner(e, inst) {\n  var corner = e.target;\n  corner.classList.add('fc-hover');\n};\n\nvar unhoverCorner = function unhoverCorner(e, inst) {\n  var corner = e.target;\n  corner.classList.remove('fc-hover');\n};\n\nvar clickCorner = function clickCorner(e, inst) {\n  var corner = e.target;\n  var slug = corner.dataset.slug;\n  var active = inst.elems.embed.dataset.active;\n\n  if (!slug) {\n    return;\n  }\n\n  if (slug == active) {\n    inst.closeCorner(slug);\n  } else {\n    inst.openCorner(slug);\n  }\n};\n\nvar clickPhoto = function clickPhoto(e, inst) {\n  inst.closeCorner();\n}; // const addStyles = (elem, styles) => {\n// \tObject.entries(styles).forEach(([prop, val]) => {\n// \t\telem.style[prop] = val;\n// \t});\n// \treturn elem;\n// }\n//Adds namespace to all classes\n// const fc = (input) => {\n// \tconst ns = 'fc';\n// \tlet output = [];\n// \tif(!Array.isArray(input)){input = [input];}\n// \tinput.forEach(function(str, i) {\n// \t\toutput[i] = ns+'_'+str;\n// \t});\n// \treturn output;\n// }\n\n\nvar wrapUrls = function wrapUrls(str) {\n  var urlPattern = /(?:(?:https?|ftp):\\/\\/)?(?:\\S+(?::\\S*)?@)?(?:(?!10(?:\\.\\d{1,3}){3})(?!127(?:\\.\\d{1,3}){3})(?!169\\.254(?:\\.\\d{1,3}){2})(?!192\\.168(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\x{00a1}\\-\\x{ffff}0-9]+-?)*[a-z\\x{00a1}\\-\\x{ffff}0-9]+)(?:\\.(?:[a-z\\x{00a1}\\-\\x{ffff}0-9]+-?)*[a-z\\x{00a1}\\-\\x{ffff}0-9]+)*(?:\\.(?:[a-z\\x{00a1}\\-\\x{ffff}]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?/ig;\n  return str.replace(urlPattern, function (url) {\n    var protocol_pattern = /^(?:(?:https?|ftp):\\/\\/)/i;\n    var href = protocol_pattern.test(url) ? url : 'http://' + url;\n    return '<a href=\"' + href + '\" target=\"_blank\">' + url + '</a>';\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (FourCorners);\n\n//# sourceURL=webpack://FourCorners/./src/index.js?");

/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://FourCorners/./src/styles.scss?");

/***/ }),

/***/ 0:
/*!************************!*\
  !*** multi ./index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! /Users/coreytegeler/Sites/four-corners.js/index.js */\"./index.js\");\n\n\n//# sourceURL=webpack://FourCorners/multi_./index.js?");

/***/ })

/******/ });
});