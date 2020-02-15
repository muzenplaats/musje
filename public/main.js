/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _model_Pitch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/Pitch */ \"./src/model/Pitch.js\");\n/* harmony import */ var _player_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player/player */ \"./src/player/player.js\");\n\n\nvar p = new _model_Pitch__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n  step: 6,\n  octave: 0,\n  accidental: ''\n});\np.alter = 0;\nconsole.log(p.toJSON(), '' + p, p.midiNumber, p.frequency);\n\nfunction component() {\n  var div = document.createElement('div');\n  var btn = document.createElement('button');\n  btn.innerHTML = '&gt;';\n  btn.addEventListener('click', function () {\n    return Object(_player_player__WEBPACK_IMPORTED_MODULE_1__[\"play\"])(p.frequency);\n  }, false);\n  div.appendChild(btn);\n  return div;\n}\n\ndocument.body.appendChild(component());\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/model/Lexer.js":
/*!****************************!*\
  !*** ./src/model/Lexer.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_makeLexerClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/makeLexerClass */ \"./src/utils/makeLexerClass.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Lexer);\nvar Lexer = Object(_utils_makeLexerClass__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({});\n\n//# sourceURL=webpack:///./src/model/Lexer.js?");

/***/ }),

/***/ "./src/model/Pitch.js":
/*!****************************!*\
  !*** ./src/model/Pitch.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lexer */ \"./src/model/Lexer.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ \"./src/utils/helpers.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar STEP_TO_SEMITONE = {\n  1: 0,\n  2: 2,\n  3: 4,\n  4: 5,\n  5: 7,\n  6: 9,\n  7: 11\n};\n\nvar Pitch =\n/*#__PURE__*/\nfunction () {\n  function Pitch(pitch, style) {\n    _classCallCheck(this, Pitch);\n\n    this.toJSON = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"makeToJSON\"])('step', 'accidental', 'octave');\n    this.name = 'pitch';\n    this.style = style;\n\n    if (pitch.name === 'lexer') {\n      this.parse(pitch);\n    } else if (typeof pitch === 'string') {\n      this.parse(new _Lexer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](pitch));\n    } else {\n      this.step = pitch.step;\n      this.accidental = pitch.accidental;\n      this.octave = pitch.octave;\n    }\n  }\n\n  _createClass(Pitch, [{\n    key: \"parse\",\n    value: function parse(lexer) {}\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      var step = this.step,\n          accidental = this.accidental,\n          octave = this.octave;\n      var oct = octave > 0 ? Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"repeat\"])('\\'', octave) : Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"repeat\"])(',', -octave);\n      return \"\".concat(accidental).concat(step).concat(oct);\n    }\n  }, {\n    key: \"midiNumber\",\n    get: function get() {\n      return STEP_TO_SEMITONE[this.step] + this.alter + this.octave * 12 + 60;\n    }\n  }, {\n    key: \"frequency\",\n    get: function get() {\n      return Math.pow(2, (this.midiNumber - 69) / 12) * 440;\n    }\n  }]);\n\n  return Pitch;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Pitch);\n\n//# sourceURL=webpack:///./src/model/Pitch.js?");

/***/ }),

/***/ "./src/player/player.js":
/*!******************************!*\
  !*** ./src/player/player.js ***!
  \******************************/
/*! exports provided: play */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"play\", function() { return play; });\nvar _ctx;\n\nvar getContext = function getContext() {\n  return _ctx || (_ctx = new AudioContext());\n};\n\nvar play = function play(f) {\n  var context = getContext();\n  var oscillator = context.createOscillator();\n  oscillator.type = 'square';\n  oscillator.frequency.setValueAtTime(f, context.currentTime); // value in hertz\n\n  oscillator.connect(context.destination);\n  oscillator.start();\n};\n\n//# sourceURL=webpack:///./src/player/player.js?");

/***/ }),

/***/ "./src/utils/helpers.js":
/*!******************************!*\
  !*** ./src/utils/helpers.js ***!
  \******************************/
/*! exports provided: repeat, makeToJSON */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"repeat\", function() { return repeat; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeToJSON\", function() { return makeToJSON; });\nvar repeat = function repeat(rep, num) {\n  return new Array(num + 1).join(rep);\n};\nvar slice = [].slice;\nfunction makeToJSON() {\n  var list = ['name'].concat(slice.apply(arguments));\n  return function () {\n    var _this = this;\n\n    var result = {};\n    list.forEach(function (key) {\n      result[key] = _this[key];\n    });\n    return result;\n  };\n}\n\n//# sourceURL=webpack:///./src/utils/helpers.js?");

/***/ }),

/***/ "./src/utils/makeLexerClass.js":
/*!*************************************!*\
  !*** ./src/utils/makeLexerClass.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return makeLexerClass; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction makeLexerClass(patterns) {\n  return (\n    /*#__PURE__*/\n    function () {\n      function Lexer(src) {\n        _classCallCheck(this, Lexer);\n\n        this.name = 'lexer';\n        this.src = src;\n      }\n\n      _createClass(Lexer, [{\n        key: \"eat\",\n        value: function eat() {}\n      }, {\n        key: \"token\",\n        value: function token(tkn) {}\n      }, {\n        key: \"optional\",\n        value: function optional(token) {}\n      }, {\n        key: \"without\",\n        value: function without(token) {}\n      }, {\n        key: \"mlwithout\",\n        value: function mlwithout(token) {}\n      }, {\n        key: \"error\",\n        value: function error(message) {}\n      }]);\n\n      return Lexer;\n    }()\n  );\n}\n\n//# sourceURL=webpack:///./src/utils/makeLexerClass.js?");

/***/ })

/******/ });