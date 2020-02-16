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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _model_Pitch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/Pitch */ \"./src/model/Pitch.js\");\n/* harmony import */ var _model_Duration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model/Duration */ \"./src/model/Duration.js\");\n/* harmony import */ var _model_Note__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/Note */ \"./src/model/Note.js\");\n/* harmony import */ var _model_Rest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/Rest */ \"./src/model/Rest.js\");\n/* harmony import */ var _model_Chord__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/Chord */ \"./src/model/Chord.js\");\n/* harmony import */ var _player_player__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./player/player */ \"./src/player/player.js\");\n\n\n\n\n\n\nvar p = new _model_Pitch__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n  step: 6,\n  octave: 0,\n  accidental: ''\n});\np.alter = 0;\nconsole.log(p.toJSON(), '' + p, p.midiNumber, p.frequency);\nvar p2 = new _model_Pitch__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('#3,');\nconsole.log(p2.toJSON(), '' + p2);\nvar d = new _model_Duration__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('=_..');\nconsole.log(d.toJSON(), '' + d);\nvar n = new _model_Note__WEBPACK_IMPORTED_MODULE_2__[\"default\"](\"b5''---.\");\nconsole.log(n.toJSON(), '' + n);\nvar r = new _model_Rest__WEBPACK_IMPORTED_MODULE_3__[\"default\"]('0-..');\nconsole.log(r.toJSON(), '' + r);\nvar c = new _model_Chord__WEBPACK_IMPORTED_MODULE_4__[\"default\"](\"<1#351'>_\");\nconsole.log(c.toJSON(), '' + c);\n\nfunction component() {\n  var div = document.createElement('div');\n  var btn = document.createElement('button');\n  btn.innerHTML = '&gt;';\n  btn.addEventListener('click', function () {\n    return Object(_player_player__WEBPACK_IMPORTED_MODULE_5__[\"play\"])(p.frequency);\n  }, false);\n  div.appendChild(btn);\n  return div;\n}\n\ndocument.body.appendChild(component());\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/model/Chord.js":
/*!****************************!*\
  !*** ./src/model/Chord.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Chord; });\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lexer */ \"./src/model/Lexer.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ \"./src/utils/helpers.js\");\n/* harmony import */ var _Pitch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Pitch */ \"./src/model/Pitch.js\");\n/* harmony import */ var _Duration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Duration */ \"./src/model/Duration.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\n\nvar Chord =\n/*#__PURE__*/\nfunction () {\n  function Chord(chord, style) {\n    _classCallCheck(this, Chord);\n\n    this.toJSON = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"makeToJSON\"])('pitches', 'duration');\n    this.name = 'chord';\n    this.style = style;\n\n    if (chord.name === 'lexer') {\n      this.parse(chord);\n    } else if (typeof chord === 'string') {\n      this.parse(new _Lexer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](chord));\n    } else {\n      this.pitches = chord.pitches.map(function (pitch) {\n        return new _Pitch__WEBPACK_IMPORTED_MODULE_2__[\"default\"](pitch);\n      });\n      this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_3__[\"default\"](chord.duration, style);\n    }\n  }\n\n  _createClass(Chord, [{\n    key: \"parse\",\n    value: function parse(lexer) {\n      this.pitches = [];\n      lexer.token('<');\n\n      while (lexer.is('pitch')) {\n        this.pitches.push(new _Pitch__WEBPACK_IMPORTED_MODULE_2__[\"default\"](lexer));\n      }\n\n      lexer.token('>');\n      this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_3__[\"default\"](lexer);\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return \"<\".concat(this.pitches.join(''), \">\").concat(this.duration);\n    }\n  }]);\n\n  return Chord;\n}();\n\n\n\n//# sourceURL=webpack:///./src/model/Chord.js?");

/***/ }),

/***/ "./src/model/Duration.js":
/*!*******************************!*\
  !*** ./src/model/Duration.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Duration; });\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lexer */ \"./src/model/Lexer.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ \"./src/utils/helpers.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar STR_TO_TYPE = {\n  '---': 1,\n  '-': 2,\n  '': 4,\n  '_': 8,\n  '=': 16,\n  '=_': 32,\n  '==': 64,\n  '==_': 128,\n  '===': 256,\n  '===_': 512,\n  '====': 1024\n};\nvar TYPE_TO_STR = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"swapObject\"])(STR_TO_TYPE);\n\nvar Duration =\n/*#__PURE__*/\nfunction () {\n  function Duration(duration, style) {\n    _classCallCheck(this, Duration);\n\n    this.toJSON = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"makeToJSON\"])('type', 'dot');\n    this.name = 'duration';\n\n    if (duration.name === 'lexer') {\n      this.parse(duration);\n    } else if (typeof duration === 'string') {\n      this.parse(new _Lexer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](duration));\n    } else {\n      this.type = duration.type;\n      this.dot = duration.dot;\n    }\n  }\n\n  _createClass(Duration, [{\n    key: \"parse\",\n    value: function parse(lexer) {\n      var _this = this;\n\n      lexer.optional('type', function (lexeme) {\n        _this.type = STR_TO_TYPE[lexeme];\n      });\n      lexer.optional('dot', function (lexeme) {\n        _this.dot = lexeme.length;\n      });\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return \"\".concat(TYPE_TO_STR[this.type]).concat(Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"repeat\"])('.', this.dot));\n    }\n  }]);\n\n  return Duration;\n}();\n\n\n\n//# sourceURL=webpack:///./src/model/Duration.js?");

/***/ }),

/***/ "./src/model/Lexer.js":
/*!****************************!*\
  !*** ./src/model/Lexer.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_makeLexerClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/makeLexerClass */ \"./src/utils/makeLexerClass.js\");\n\nvar Lexer = Object(_utils_makeLexerClass__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n  0: '0',\n  '<': '<',\n  '>': '>',\n  step: '[1-7]',\n  accidental: '(#{1,2}|n|b{1,2})',\n  octave: \"('{1,5}|,{1,5})\",\n  type: '(---|-|={0,5}_|={1,5})',\n  dot: '\\.{1,2}',\n  pitch: '[#nb]*[1-7]',\n  duration: '[-_=]*\\.{1,2}',\n  note: '[#nb]*[1-7]',\n  rest: '0',\n  chord: '<[#nb]*[1-7]'\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (Lexer);\n\n//# sourceURL=webpack:///./src/model/Lexer.js?");

/***/ }),

/***/ "./src/model/Note.js":
/*!***************************!*\
  !*** ./src/model/Note.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Note; });\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers */ \"./src/utils/helpers.js\");\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lexer */ \"./src/model/Lexer.js\");\n/* harmony import */ var _Pitch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Pitch */ \"./src/model/Pitch.js\");\n/* harmony import */ var _Duration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Duration */ \"./src/model/Duration.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\n\nvar Note =\n/*#__PURE__*/\nfunction () {\n  function Note(note, style) {\n    _classCallCheck(this, Note);\n\n    this.toJSON = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_0__[\"makeToJSON\"])('pitch', 'duration');\n    this.name = 'note';\n    this.style = style;\n\n    if (note.name === 'lexer') {\n      this.parse(note);\n    } else if (typeof note === 'string') {\n      this.parse(new _Lexer__WEBPACK_IMPORTED_MODULE_1__[\"default\"](note));\n    } else {\n      this.pitch = new _Pitch__WEBPACK_IMPORTED_MODULE_2__[\"default\"](note.pitch, style);\n      this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_3__[\"default\"](note.duration, style);\n    }\n  }\n\n  _createClass(Note, [{\n    key: \"parse\",\n    value: function parse(lexer) {\n      this.pitch = new _Pitch__WEBPACK_IMPORTED_MODULE_2__[\"default\"](lexer, this.style);\n      this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_3__[\"default\"](lexer, this.style);\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return \"\".concat(this.pitch).concat(this.duration);\n    }\n  }]);\n\n  return Note;\n}();\n\n\n\n//# sourceURL=webpack:///./src/model/Note.js?");

/***/ }),

/***/ "./src/model/Pitch.js":
/*!****************************!*\
  !*** ./src/model/Pitch.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Pitch; });\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lexer */ \"./src/model/Lexer.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ \"./src/utils/helpers.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar STEP_TO_SEMITONE = {\n  1: 0,\n  2: 2,\n  3: 4,\n  4: 5,\n  5: 7,\n  6: 9,\n  7: 11\n};\n\nvar Pitch =\n/*#__PURE__*/\nfunction () {\n  function Pitch(pitch, style) {\n    _classCallCheck(this, Pitch);\n\n    this.toJSON = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"makeToJSON\"])('step', 'accidental', 'octave');\n    this.name = 'pitch';\n    this.style = style;\n\n    if (pitch.name === 'lexer') {\n      this.parse(pitch);\n    } else if (typeof pitch === 'string') {\n      this.parse(new _Lexer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](pitch));\n    } else {\n      this.step = pitch.step;\n      this.accidental = pitch.accidental;\n      this.octave = pitch.octave;\n    }\n  }\n\n  _createClass(Pitch, [{\n    key: \"parse\",\n    value: function parse(lexer) {\n      var _this = this;\n\n      lexer.optional('accidental', function (lexeme) {\n        _this.accidental = lexeme;\n      });\n      lexer.token('step', function (lexeme) {\n        _this.step = +lexeme;\n      });\n      lexer.optional('octave', function (lexeme) {\n        _this.octave = lexeme[0] === \"'\" ? lexeme.length : lexeme[0] === ',' ? -lexeme.length : 0;\n      });\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      var step = this.step,\n          accidental = this.accidental,\n          octave = this.octave;\n      var oct = octave > 0 ? Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"repeat\"])('\\'', octave) : Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"repeat\"])(',', -octave);\n      return \"\".concat(accidental).concat(step).concat(oct);\n    }\n  }, {\n    key: \"midiNumber\",\n    get: function get() {\n      return STEP_TO_SEMITONE[this.step] + this.alter + this.octave * 12 + 60;\n    }\n  }, {\n    key: \"frequency\",\n    get: function get() {\n      return Math.pow(2, (this.midiNumber - 69) / 12) * 440;\n    }\n  }]);\n\n  return Pitch;\n}();\n\n\n\n//# sourceURL=webpack:///./src/model/Pitch.js?");

/***/ }),

/***/ "./src/model/Rest.js":
/*!***************************!*\
  !*** ./src/model/Rest.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Rest; });\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lexer */ \"./src/model/Lexer.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ \"./src/utils/helpers.js\");\n/* harmony import */ var _Duration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Duration */ \"./src/model/Duration.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nvar Rest =\n/*#__PURE__*/\nfunction () {\n  function Rest(rest, style) {\n    _classCallCheck(this, Rest);\n\n    this.toJSON = Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__[\"makeToJSON\"])('duration');\n    this.name = 'rest';\n    this.style = style;\n\n    if (rest.name === 'lexer') {\n      this.parse(rest);\n    } else if (typeof rest === 'string') {\n      this.parse(new _Lexer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](rest));\n    } else {\n      this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_2__[\"default\"](rest.duration, style);\n    }\n  }\n\n  _createClass(Rest, [{\n    key: \"parse\",\n    value: function parse(lexer) {\n      lexer.token('0');\n      this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_2__[\"default\"](lexer, this.style);\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return '0' + this.duration;\n    }\n  }]);\n\n  return Rest;\n}();\n\n\n\n//# sourceURL=webpack:///./src/model/Rest.js?");

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
/*! exports provided: repeat, swapObject, makeToJSON */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"repeat\", function() { return repeat; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"swapObject\", function() { return swapObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeToJSON\", function() { return makeToJSON; });\nvar repeat = function repeat(rep, num) {\n  return new Array(num + 1).join(rep);\n};\nvar swapObject = function swapObject(obj) {\n  var result = {};\n\n  for (var key in obj) {\n    result[obj[key]] = key;\n  }\n\n  return result;\n};\nvar slice = [].slice;\nfunction makeToJSON() {\n  var list = ['name'].concat(slice.apply(arguments));\n  return function () {\n    var _this = this;\n\n    var result = {};\n    list.forEach(function (key) {\n      result[key] = _this[key];\n    });\n    return result;\n  };\n}\n\n//# sourceURL=webpack:///./src/utils/helpers.js?");

/***/ }),

/***/ "./src/utils/makeLexerClass.js":
/*!*************************************!*\
  !*** ./src/utils/makeLexerClass.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return makeLexerClass; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/utils/helpers.js\");\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Lines =\n/*#__PURE__*/\nfunction () {\n  function Lines(str) {\n    _classCallCheck(this, Lines);\n\n    this.data = str.split('\\n');\n    this.ln = -1;\n    this.nextLine();\n  }\n\n  _createClass(Lines, [{\n    key: \"nextLine\",\n    value: function nextLine() {\n      this.ln++;\n      this.line = new Line(this.data[this.ln]);\n    }\n  }, {\n    key: \"eof\",\n    get: function get() {\n      return this.ln === this.data.length - 1 && this.line.eol;\n    }\n  }]);\n\n  return Lines;\n}();\n\nvar Line =\n/*#__PURE__*/\nfunction () {\n  function Line(str) {\n    _classCallCheck(this, Line);\n\n    this.str = str;\n    this.rest = str;\n    this.col = 0;\n  }\n\n  _createClass(Line, [{\n    key: \"advance\",\n    value: function advance(num) {\n      this.col += num;\n      this.rest = this.rest.substr(num);\n    }\n  }, {\n    key: \"eol\",\n    get: function get() {\n      return this.rest.length === 0;\n    }\n  }]);\n\n  return Line;\n}();\n\nvar defaultPatterns = {\n  S: ' ',\n  SS: ' +'\n};\n\nvar getPatterns = function getPatterns(patterns) {\n  patterns = _objectSpread({}, defaultPatterns, {}, patterns);\n  var result = [{}, {}];\n\n  for (var key in patterns) {\n    result[0][key] = new RegExp(patterns[key]);\n    result[1][key] = new RegExp('^' + patterns[key]);\n  }\n\n  return result;\n};\n\nfunction makeLexerClass(patterns) {\n  return (\n    /*#__PURE__*/\n    function () {\n      function Lexer(src) {\n        _classCallCheck(this, Lexer);\n\n        this.name = 'lexer';\n        this.src = src.replace(/\\r\\n/g, '\\n');\n        this.lines = new Lines(src);\n        var ptrns = getPatterns(patterns);\n        this.withoutPatterns = ptrns[0];\n        this.patterns = ptrns[1];\n      }\n\n      _createClass(Lexer, [{\n        key: \"newLine\",\n        value: function newLine() {\n          this.lines.newLine();\n        }\n      }, {\n        key: \"getPattern\",\n        value: function getPattern(token) {\n          if (token in this.patterns) return this.patterns[token];\n          this.error(\"undefined token [\".concat(token, \"]\"));\n        }\n      }, {\n        key: \"eat\",\n        value: function eat(token) {\n          var matched = this.line.rest.match(this.getPattern(token));\n          if (!matched) this.error(\"[$token]\");\n          this.lexeme = matched[0];\n          this.line.advance(this.lexeme.length);\n        }\n      }, {\n        key: \"is\",\n        value: function is(token) {\n          return this.getPattern(token).test(this.line.rest);\n        }\n      }, {\n        key: \"token\",\n        value: function token(tkn, act) {\n          this.eat(tkn);\n          if (act) act(this.lexeme);\n        }\n      }, {\n        key: \"optional\",\n        value: function optional(token, act) {\n          this.lexeme = '';\n          if (this.is(token)) this.eat(token);\n          if (act) act(this.lexeme);\n        }\n      }, {\n        key: \"without\",\n        value: function without(token, act) {\n          var matched = this.line.rest.match(this.getWithoutPattern(token));\n          this.lexeme = matched ? this.line.rest.substr(0, matched.index - 1) : this.line.rest;\n          this.line.advance(this.lexeme.length);\n          if (act) act(this.lexeme);\n        }\n      }, {\n        key: \"mlwithout\",\n        value: function mlwithout(token, act) {\n          var pattern = this.getWithoutPattern(token);\n          var strs = [];\n          var matched = this.line.rest.match(pattern);\n\n          while (!matched) {\n            this.str.push(this.line.rest);\n            this.line.advance(this.line.rest.length);\n            if (this.eof) break;\n            matched = this.line.rest.match(pattern);\n          }\n\n          if (matched) strs.push(this.line.rest.substr(0, matched.index - 1));\n          this.lexeme = strs.join('\\n');\n          if (act) act(this.lexeme);\n        }\n      }, {\n        key: \"error\",\n        value: function error(message) {\n          throw new Error(\"\".concat(message, \" at line \").concat(this.ln, \" column \").concat(this.col, \".\\n\").concat(this.line.str, \"\\n\").concat(Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"repeat\"])(' ', this.line.col), \"^\"));\n        }\n      }, {\n        key: \"skipSS\",\n        value: function skipSS() {\n          this.optional('SS');\n        }\n      }, {\n        key: \"skipWhite\",\n        value: function skipWhite() {\n          this.mlwithout('SS');\n        }\n      }, {\n        key: \"line\",\n        get: function get() {\n          return this.lines.line;\n        }\n      }, {\n        key: \"ln\",\n        get: function get() {\n          return this.lines.ln;\n        }\n      }, {\n        key: \"col\",\n        get: function get() {\n          return this.line.col;\n        }\n      }]);\n\n      return Lexer;\n    }()\n  );\n}\n\n//# sourceURL=webpack:///./src/utils/makeLexerClass.js?");

/***/ })

/******/ });