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
eval("__webpack_require__.r(__webpack_exports__);\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar FourCorners =\n/*#__PURE__*/\nfunction () {\n  function FourCorners(embed, opts) {\n    _classCallCheck(this, FourCorners);\n\n    this.elems = {};\n    this.opts = opts;\n    this.corners = ['authorship', 'backstory', 'imagery', 'links'];\n    this.cornerTitles = ['Authorship', 'Backstory', 'Related Imagery', 'Links'];\n    this.elems.embed = embed;\n    this.data = parseData(this);\n    this.elems.photo = addPhoto(this);\n    this.elems.panels = addPanels(this);\n    this.elems.corners = addCorners(this);\n    this.elems.caption = addCutline(this);\n    initEmbed(this);\n  }\n\n  _createClass(FourCorners, [{\n    key: \"init\",\n    value: function init(userOpts) {\n      var proto = this;\n      proto.embeds = [];\n      var defaultOpts = {\n        selector: '.fc-embed:not(.fc-init)',\n        interactive: true,\n        active: null,\n        cutline: true,\n        posDur: 0.2,\n        transDur: 0.1\n      };\n      var opts = Object.assign(defaultOpts, userOpts);\n      var embeds = Array.from(document.querySelectorAll(opts.selector));\n      embeds.forEach(function (embed, i) {\n        var inst = new FourCorners(embed, opts);\n        proto.embeds.push(inst);\n      });\n      return proto.embeds;\n    }\n  }, {\n    key: \"getPanel\",\n    value: function getPanel(slug) {\n      var embed = this.elems.embed;\n\n      if (!embed) {\n        return;\n      }\n\n      var panelSelector = '.fc-panel';\n\n      if (slug) {\n        panelSelector += '[data-fc-slug=\"' + slug + '\"]';\n        return embed.querySelector(panelSelector);\n      }\n\n      return embed.querySelectorAll(panelSelector);\n    }\n  }, {\n    key: \"openPanel\",\n    value: function openPanel(slug) {\n      var inst = this;\n      var corners = inst.corners;\n      var embed = inst.elems.embed;\n      var corner = inst.elems.corners[slug]; // const panel = this.elems.panels[slug];\n\n      var panel = inst.getPanel(slug);\n      embed.classList.remove('fc-full');\n\n      if (embed && corner && panel) {\n        embed.dataset.fcActive = slug;\n        embed.classList.add('fc-active');\n        corner.classList.add('fc-active');\n        panel.classList.add('fc-active');\n      }\n\n      corners.forEach(function (_slug, i) {\n        if (_slug != slug) {\n          inst.closePanel(_slug);\n        }\n      });\n    }\n  }, {\n    key: \"closePanel\",\n    value: function closePanel(slug) {\n      var inst = this;\n      var embed = inst.elems.embed;\n\n      if (!slug) {\n        slug = embed.dataset.fcActive;\n      }\n\n      if (!slug) {\n        return;\n      }\n\n      var corner = inst.elems.corners[slug];\n      var panel = inst.getPanel(slug);\n\n      if (slug == embed.dataset.fcActive) {\n        embed.dataset.fcActive = '';\n        embed.classList.remove('fc-active');\n      }\n\n      if (corner) {\n        corner.classList.remove('fc-active');\n      }\n\n      if (panel) {\n        panel.classList.remove('fc-active');\n      }\n    }\n  }, {\n    key: \"toggleExpandPanel\",\n    value: function toggleExpandPanel() {\n      var inst = this;\n      inst.elems.embed.classList.toggle('fc-full');\n    }\n  }]);\n\n  return FourCorners;\n}();\n\nvar initEmbed = function initEmbed(inst) {\n  var embed = inst.elems.embed;\n  embed.classList.add('fc-init');\n\n  if (inst.data && inst.data.opts && inst.data.opts.dark) {\n    embed.classList.add('fc-dark');\n  }\n\n  if (inst.opts.interactive) {\n    window.addEventListener('resize', function (e) {\n      resizeEmbed(e, inst);\n    });\n    window.addEventListener('click', function (e) {\n      var onPanels = isChildOf(e.target, inst.getPanel());\n      var onCorners = isChildOf(e.target, inst.elems.corners);\n      var inCreator = isChildOf(e.target, Array.from(document.querySelectorAll('#creator')));\n\n      if (!onPanels && !onCorners && !inCreator) {\n        inst.closePanel();\n        inst.elems.embed.classList.remove('fc-full');\n      }\n    });\n  }\n\n  resizeEmbed(null, inst);\n};\n\nvar resizeEmbed = function resizeEmbed(e, inst) {\n  var panels = inst.getPanel();\n\n  if (!panels) {\n    return;\n  }\n\n  Object.keys(panels).forEach(function (slug, i) {\n    resizePanel(panels[slug]);\n  });\n};\n\nvar resizePanel = function resizePanel(panel) {\n  if (typeof panel.querySelector !== 'function') {\n    return;\n  }\n\n  var panelScroll = panel.querySelector('.fc-scroll');\n\n  if (!panelScroll) {\n    return;\n  }\n\n  if (panelScroll.scrollHeight > panelScroll.clientHeight) {\n    panel.classList.add('fc-overflow');\n  } else {\n    panel.classList.remove('fc-overflow');\n  }\n};\n\nvar addPhoto = function addPhoto(inst) {\n  var embed = inst.elems.embed;\n  var data = inst.data;\n\n  if (!data) {\n    return;\n  }\n\n  var photo, img;\n  var photoSelector = '.fc-photo';\n\n  if (embed.querySelector(photoSelector)) {\n    photo = embed.querySelector(photoSelector); // photo = document.createElement('div');\n    // photo.classList.add('fc-photo');\n    // embed.appendChild(photo);\n    // \tconst pseudoImg = new Image();\n    // \tconst photoData = data.photo;\n    // \tif(!photoData) {return}\n    // \tconst src = photoData.file;\n    // \tpseudoImg.onload = (e) => {\n    // \t\timg.src = src;\n    // \t\tphoto.classList.add('fc-loaded');\n    // \t\tphoto.appendChild(img);\n    // \t}\n    // \tpseudoImg.onerror = (e) => {\n    // \t\tconsole.warn('Four Corners cannot load this as an image: '+src, e);\n    // \t}\n    // \tpseudoImg.src = src;\n  } else {\n    photo = \"<div class=\\\"fc-photo\\\"></div>\";\n    embed.innerHTML += photo;\n  }\n\n  var imgSelector = '.fc-img';\n\n  if (img = embed.querySelector(imgSelector)) {\n    embed.classList.add('fc-loaded');\n    embed.appendChild(img);\n  } // else {\n  // img = `<div class=\"fc-img\"></div>`;\n  // }\n\n\n  return photo;\n};\n\nvar addPanels = function addPanels(inst) {\n  var data,\n      panels = {};\n  var embed = inst.elems.embed;\n  inst.corners.forEach(function (slug, i) {\n    var active = inst.opts.active;\n    var panel = inst.getPanel(slug);\n\n    if (!panel) {\n      var panelContent = '';\n\n      if (inst.data && inst.data[slug]) {\n        var panelData = inst.data[slug];\n\n        switch (slug) {\n          case 'authorship':\n            panelContent = buildAuthorship(inst, panelData);\n            break;\n\n          case 'backstory':\n            panelContent = buildBackstory(inst, panelData);\n            break;\n\n          case 'imagery':\n            panelContent = buildImagery(inst, panelData);\n            break;\n\n          case 'links':\n            panelContent = buildLinks(inst, panelData);\n            break;\n        }\n      }\n\n      var panelTile = inst.cornerTitles[i];\n      var panelHTML = \"<div data-fc-slug=\\\"\".concat(slug, \"\\\" class=\\\"fc-panel fc-\").concat(slug, \"\\\">\\n\\t\\t\\t\\t\\t<div class=\\\"fc-panel-title\\\">\\n\\t\\t\\t\\t\\t\\t<span>\").concat(panelTile, \"</span>\\n\\t\\t\\t\\t\\t\\t<div class=\\\"fc-icon fc-expand\\\"></div>\\n\\t\\t\\t\\t\\t\\t<div class=\\\"fc-icon fc-close\\\"></div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\\"fc-panel-title fc-pseudo\\\">\\n\\t\\t\\t\\t\\t\\t<span>\").concat(inst.corners.indexOf(slug), \"</span>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\").concat(panelContent ? \"<div class=\\\"fc-scroll\\\">\\n\\t\\t\\t\\t\\t\\t<div class=\\\"fc-inner\\\">\\n\\t\\t\\t\\t\\t\\t\\t\".concat(panelContent, \"\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\") : '', \"\\n\\t\\t\\t\\t</div>\");\n      inst.elems.embed.innerHTML += panelHTML;\n    }\n  });\n  inst.corners.forEach(function (slug, i) {\n    var panel = inst.getPanel(slug);\n    panels[slug] = panel;\n    var panelExpand = panel.querySelector('.fc-expand');\n    panelExpand.addEventListener('click', function (e) {\n      inst.toggleExpandPanel();\n    });\n    var panelClose = panel.querySelector('.fc-close');\n    panelClose.addEventListener('click', function (e) {\n      inst.closePanel(slug);\n      inst.elems.embed.classList.remove('fc-full');\n    });\n  });\n  return panels;\n};\n\nvar createRow = function createRow(panelData, obj, includeLabel) {\n  var label = includeLabel ? \"<div class=\\\"fc-label\\\">\".concat(obj.label, \"</div>\") : '';\n  var content = panelData[obj.prop];\n  return panelData[obj.prop] ? \"<div class=\\\"fc-row\\\">\\n\\t\\t\\t\".concat(label, \"\\n\\t\\t\\t\").concat(content, \"\\n\\t\\t</div>\") : '';\n};\n\nvar buildAuthorship = function buildAuthorship(inst, panelData) {\n  var hasCopyright = hasField(panelData, 'license', 'label') && panelData['license'].type == 'copyright';\n  var html,\n      innerHtml = \"\";\n  innerHtml += panelData['caption'] ? \"<div class=\\\"fc-field\\\">\\n\\t\\t\\t<em>\".concat(panelData['caption'], \"</em>\\n\\t\\t</div>\") : '';\n  innerHtml += hasField(panelData, 'license', 'credit') || hasCopyright ? \"<div class=\\\"fc-field\\\" data-fc-field=\\\"credit\\\">\\n\\t\\t\\t\\t<div class=\\\"fc-content\\\">\\n\\t\\t\\t\\t\\t\".concat(hasCopyright ? \"<span class=\\\"fc-copyright\\\">\\n\\t\\t\\t\\t\\t\\t\\t\".concat(hasField(panelData, 'license', 'label') ? \"<span>\".concat(panelData['license'].label, \"</span>\") : '', \"\\n\\t\\t\\t\\t\\t\\t</span>\") : '', \"\\n\\t\\t\\t\\t\\t\").concat(hasField(panelData, 'credit') ? panelData['credit'] : '', \"\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\") : '';\n  innerHtml += panelData['license'] && panelData['license'].type == 'commons' ? \"<div class=\\\"fc-field\\\" data-fc-field=\\\"license\\\">\\n\\t\\t\\t\\t<span class=\\\"fc-label\\\">License</span>\\n\\t\\t\\t\\t<span class=\\\"fc-content\\\">\\n\\t\\t\\t\\t\\t\".concat(panelData['license'].url ? \"<a href=\\\"\".concat(panelData['license'].url, \"\\\" target=\\\"_blank\\\">\\n\\t\\t\\t\\t\\t\\t\").concat(panelData['license'].label ? panelData['license'].label : '', \"\\n\\t\\t\\t\\t\\t</a>\") : panelData['license'].label ? panelData['license'].label : '', \"\\n\\t\\t\\t\\t</span>\\n\\t\\t\\t</div>\") : '';\n  innerHtml += panelData['ethics'] ? \"<div class=\\\"fc-field\\\">\\n\\t\\t\\t<span class=\\\"fc-label\\\">Code of ethics</span>\\n\\t\\t\\t\".concat(panelData['ethics'], \"\\n\\t\\t</div>\") : '';\n  innerHtml += panelData['bio'] ? \"<div class=\\\"fc-field\\\">\\n\\t\\t\\t<span class=\\\"fc-label\\\">Bio</span>\\n\\t\\t\\t\".concat(panelData['bio'], \"\\n\\t\\t</div>\") : '';\n  innerHtml += panelData['website'] || panelData['0-contact'] || panelData['1-contact'] ? \"<div class=\\\"fc-field fc-contact\\\">\\n\\n\\t\\t\\t\".concat(panelData['website'] ? \"<div class=\\\"fc-field fc-card\\\">\\n\\t\\t\\t\\t<div class=\\\"fc-label\\\">Website</div>\\n\\t\\t\\t\\t\".concat(createLink(panelData['website']), \"\\n\\t\\t\\t</div>\") : '', \"\\n\\n\\t\\t\\t\").concat(panelData['0-contact'] ? \"<div class=\\\"fc-field fc-card\\\">\\n\\t\\t\\t\\t<div class=\\\"fc-label\\\">For more info contact</div>\\n\\t\\t\\t\\t\".concat(createLink(panelData['0-contact']), \"\\n\\t\\t\\t</div>\") : '', \"\\n\\n\\t\\t\\t\").concat(panelData['1-contact'] ? \"<div class=\\\"fc-field fc-card\\\">\\n\\t\\t\\t\\t<div class=\\\"fc-label\\\">For reproduction rights contact</div>\\n\\t\\t\\t\\t\".concat(createLink(panelData['1-contact']), \"\\n\\t\\t\\t</div>\") : '', \"\\n\\n\\t\\t</div>\") : '';\n\n  if (innerHtml.length) {\n    html = \"<div class=\\\"fc-row\\\">\".concat(innerHtml, \"</div>\");\n  }\n\n  return html;\n};\n\nvar buildBackstory = function buildBackstory(inst, panelData) {\n  var html = \"\".concat(panelData['text'] ? \"<div class=\\\"fc-row\\\">\\n\\t\\t\\t\".concat(wrapParagraphs(panelData['text']), \"\\n\\t\\t</div>\") : '', \"\\n\\t\\t\").concat(panelData.media ? panelData.media.map(function (obj, i) {\n    embedIframe(inst, obj, 'backstory', i);\n    return \"<div class=\\\"fc-row\\\">\\n\\t\\t\\t\\t<div class=\\\"fc-media\\\">\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\".concat(obj.caption ? \"<div class=\\\"fc-sub-caption\\\">\".concat(obj.caption, \"</div>\") : '', \"\\n\\t\\t\\t\\t\").concat(obj.credit ? \"<div class=\\\"fc-sub-credit\\\">\".concat(obj.credit, \"</div>\") : '', \"\\n\\t\\t\\t</div>\");\n  }).join('') : '');\n  return html;\n};\n\nvar buildImagery = function buildImagery(inst, panelData) {\n  if (!panelData.media) {\n    return;\n  }\n\n  var html = \"\".concat(panelData.media.map(function (obj, i) {\n    obj.source == 'image' || !obj.source ? embedImage(inst, obj, 'imagery', i) : embedIframe(inst, obj, 'imagery', i);\n    return \"<div class=\\\"fc-row\\\">\\n\\t\\t\\t\\t<div class=\\\"fc-media\\\">\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\".concat(obj.caption ? \"<div class=\\\"fc-sub-caption\\\">\".concat(obj.caption, \"</div>\") : '', \"\\n\\t\\t\\t\\t\").concat(obj.credit ? \"<div class=\\\"fc-sub-credit\\\">\".concat(obj.credit, \"</div>\") : '', \"\\n\\t\\t\\t</div>\");\n  }).join(''));\n  return html;\n};\n\nvar buildLinks = function buildLinks(inst, panelData) {\n  if (!panelData.links) {\n    return;\n  }\n\n  var html = panelData.links.map(function (obj) {\n    if (!obj || !obj.url) {\n      return null;\n    }\n\n    var rootUrl = extractRootDomain(obj.url);\n    var text = obj.url ? \"\".concat(obj.title ? obj.title : rootUrl, \"\\n\\t\\t\\t<div class=\\\"fc-sub-url\\\">\").concat(rootUrl, \"</div>\") : '';\n    return \"<div class=\\\"fc-row\\\">\".concat(createLink(obj.url, text, ['fc-card']), \"</div>\");\n  }).join('');\n  return html;\n};\n\nvar embedImage = function embedImage(inst, obj, panelKey, index) {\n  if (!obj.url) {\n    return;\n  }\n\n  var pseudoImg = new Image();\n\n  pseudoImg.onload = function (e) {\n    var img = \"<img src=\\\"\".concat(obj.url, \"\\\"/>\");\n    var panel = inst.elems.panels[panelKey];\n    var media = panel.querySelectorAll('.fc-media')[index];\n    media.innerHTML += img;\n  };\n\n  pseudoImg.onerror = function (e) {\n    console.warn('Four Corners cannot load this as an image: ' + obj.url, e);\n  };\n\n  pseudoImg.src = obj.url;\n  return;\n};\n\nvar embedIframe = function embedIframe(inst, obj, panelKey, index) {\n  //requests third party APIs to retrieve embed data\n  var req = '';\n\n  switch (obj.source) {\n    case 'youtube':\n      // req = 'https://www.youtube.com/oembed?url='+obj.url;\n      req = 'https://noembed.com/embed?url=' + obj.url;\n      break;\n\n    case 'vimeo':\n      req = 'https://vimeo.com/api/oembed.json?url=' + obj.url;\n      break;\n\n    case 'soundcloud':\n      req = 'https://soundcloud.com/oembed?format=json&url=' + obj.url;\n      break;\n\n    default:\n      return false;\n      break;\n  }\n\n  fetch(req, {\n    method: 'GET',\n    headers: {\n      'Content-Type': 'application/json'\n    }\n  }).then(function (res) {\n    if (!res.ok) {\n      throw Error(res.statusText);\n    }\n\n    return res.json();\n  }).then(function (res) {\n    var panel = inst.elems.panels[panelKey];\n    var subMedia = panel.querySelectorAll('.fc-media')[index];\n\n    if (Number.isInteger(res.width, res.height)) {\n      var ratio = res.height / res.width;\n      subMedia.classList.add('fc-responsive');\n      subMedia.style.paddingBottom = ratio * 100 + '%';\n    }\n\n    subMedia.innerHTML = res.html;\n  }).catch(function (err) {\n    console.warn('Four Corners cannot load this media source: ' + src, err);\n  });\n};\n\nvar addCorners = function addCorners(inst) {\n  var data,\n      corners = {};\n  var embed = inst.elems.embed;\n  var photo = inst.elems.photo;\n  var active = inst.opts.active;\n  inst.corners.forEach(function (slug, i) {\n    var cornerSelector = '.fc-corner[data-fc-slug=\"' + slug + '\"]';\n\n    if (embed.querySelector(cornerSelector)) {\n      return;\n    }\n\n    var corner = document.createElement('div');\n    corner.dataset.fcSlug = slug;\n    corner.classList.add('fc-corner');\n    corner.classList.add('fc-' + slug);\n\n    if (slug == active) {\n      corner.classList.add('fc-active');\n    }\n\n    if (inst.data) {\n      data = inst.data[slug];\n\n      if (!data || !Object.keys(data).length) {\n        corner.classList.add('fc-empty');\n      }\n    }\n\n    if (inst.opts.interactive) {\n      corner.addEventListener('mouseenter', function (e) {\n        hoverCorner(e, inst);\n      });\n      corner.addEventListener('mouseleave', function (e) {\n        unhoverCorner(e, inst);\n      });\n      corner.addEventListener('click', function (e) {\n        clickCorner(e, inst);\n      });\n    }\n\n    corners[slug] = corner;\n    embed.appendChild(corner);\n  });\n  return corners;\n};\n\nvar addCutline = function addCutline(inst) {\n  //check if cutline is desired\n  if (!inst.data || !inst.opts.cutline) {\n    return;\n  }\n\n  var data = inst.data['authorship'];\n  var embed = inst.elems.embed; //create cutline elem\n\n  var cutline = document.createElement('div');\n  cutline.classList.add('fc-cutline'); //add credit to cutline\n\n  if (data.credit) {\n    var credit = document.createElement('span');\n    credit.classList.add('fc-credit');\n    credit.innerHTML = data.credit;\n    cutline.appendChild(credit);\n  } //add FC link to cutline\n\n\n  var link = document.createElement('a');\n  link.classList.add('fc-link');\n  link.href = 'https://fourcornersproject.org';\n  link.target = '_blank';\n  cutline.appendChild(link); //add FC link to cutline\n\n  embed.parentNode.insertBefore(cutline, embed.nextSibling);\n};\n\nvar parseData = function parseData(inst) {\n  //extracts data string stored in attribute\n  if (!inst.elems.embed) {\n    return;\n  }\n\n  var stringData = inst.elems.embed.dataset.fc;\n\n  if (!stringData) {\n    return;\n  }\n\n  stringData = stringData; //removes attribute from DOM\n\n  delete inst.elems.embed.dataset.fc; //parses data string to JSON object\n\n  return JSON.parse(stringData);\n};\n\nvar hoverCorner = function hoverCorner(e, inst) {\n  var corner = e.target;\n  corner.classList.add('fc-hover');\n};\n\nvar unhoverCorner = function unhoverCorner(e, inst) {\n  var corner = e.target;\n  corner.classList.remove('fc-hover');\n};\n\nvar clickCorner = function clickCorner(e, inst) {\n  var corner = e.target;\n  var slug = corner.dataset.fcSlug;\n  var active = inst.elems.embed.dataset.fcActive;\n\n  if (!slug) {\n    return;\n  }\n\n  if (slug == active) {\n    inst.closePanel(slug);\n  } else {\n    inst.openPanel(slug);\n  }\n};\n\nvar isChildOf = function isChildOf(target, ref) {\n  var answer = false;\n  Object.entries(ref).forEach(function (_ref) {\n    var _ref2 = _slicedToArray(_ref, 2),\n        key = _ref2[0],\n        elem = _ref2[1];\n\n    if (elem && elem.contains(target)) {\n      answer = true;\n    }\n  });\n  return answer;\n};\n\nvar wrapParagraphs = function wrapParagraphs(val) {\n  var array = val.split(/\\n/g);\n  var text = [];\n  var html = array ? \"\".concat(array.map(function (str, i) {\n    return str ? \"<p>\".concat(str, \"</p>\") : \"<br/>\";\n  }).join('')) : '';\n  return html;\n};\n\nvar createLink = function createLink(href, text) {\n  var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];\n\n  if (!text) {\n    text = extractRootDomain(href);\n  }\n\n  if (href.indexOf('@') > -1) {\n    href = 'mailto:' + href;\n  }\n\n  return \"<a href=\\\"\".concat(href, \"\\\" target=\\\"_blank\\\" class=\\\"\").concat(classes.join(' '), \"\\\">\").concat(text, \"</a>\");\n};\n\nvar extractHostname = function extractHostname(url) {\n  var hostname;\n\n  if (!url) {\n    return false;\n  }\n\n  if (url.indexOf('//') > -1) {\n    hostname = url.split('/')[2];\n  } else {\n    hostname = url.split('/')[0];\n  }\n\n  hostname = hostname.split(':')[0];\n  hostname = hostname.split('?')[0];\n  return hostname;\n};\n\nvar extractRootDomain = function extractRootDomain(url) {\n  if (!url) {\n    return false;\n  }\n\n  var domain = extractHostname(url);\n  var splitArr = domain.split('.');\n  var arrLen = splitArr.length;\n\n  if (arrLen > 2) {\n    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];\n\n    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {\n      domain = splitArr[arrLen - 3] + '.' + domain;\n    }\n  }\n\n  return domain;\n};\n\nvar hasField = function hasField(panelData, fieldKey, subFieldKey) {\n  if (!panelData) {\n    return false;\n  }\n\n  if (!panelData[fieldKey]) {\n    return false;\n  }\n\n  if (_typeof(panelData[fieldKey]) == 'object') {\n    if (!Object.keys(panelData[fieldKey]).length) {\n      return false;\n    }\n  } else {\n    if (!panelData[fieldKey].length) {\n      return false;\n    }\n  }\n\n  if (!subFieldKey || !panelData[fieldKey][subFieldKey]) {\n    return false;\n  }\n\n  if (_typeof(panelData[fieldKey][subFieldKey]) == 'object') {\n    if (!Object.keys(panelData[fieldKey][subFieldKey]).length) {\n      return false;\n    }\n  } else {\n    if (!panelData[fieldKey][subFieldKey].length) {\n      return false;\n    }\n  }\n\n  return true;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (FourCorners);\n\n//# sourceURL=webpack://FourCorners/./src/index.js?");

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