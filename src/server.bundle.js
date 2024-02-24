/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 349:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadContent = void 0;
var fs_1 = __importDefault(__webpack_require__(896));
var readFile = function (filepath) { return fs_1.default.readFileSync("".concat(__dirname, "/").concat(filepath)); };
var content = {
    '/': readFile('../hosted/test_client.html'),
    '/index.html': readFile('../hosted/test_client.html'),
    // '/style.css': readFile('../hosted/style.css'),
    '/bundle.js': readFile('../hosted/bundle.js'),
    default: '',
};
/**
 * Retrieve content from the server
 * @param {*} params { pathName: '/hosted.html' }
 */
var loadContent = function (contentType) { return function (request, response, params) {
    console.log("Loading content: ".concat(params.pathname));
    var page = content[params.pathname || "default"] || "";
    response.writeHead(200, { 'Content-Type': contentType });
    response.write(page);
    response.end();
    console.log("Loaded content: ".concat(params.pathname));
}; };
exports.loadContent = loadContent;


/***/ }),

/***/ 108:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.headGTFOData = exports.getGTFOData = exports.head500 = exports.head404 = exports.head400 = exports.get500 = exports.get404 = exports.get400 = void 0;
var fs_1 = __importDefault(__webpack_require__(896));
var readFile = function (filepath) { return fs_1.default.readFileSync("".concat(__dirname, "/").concat(filepath)); };
var gtfoData = {
    '/api/weapons': readFile('../data/weapons.json'),
    '/api/weapon_stats': readFile('../data/weapon_stats.json'),
    '/api/categories': readFile('../data/weapon_stats.json'),
    '/api/strikers': readFile('../data/weapon_stats.json'),
};
/**
 * Builds a message response in json or xml format (decided by the accept header)
 * @param {string} message message
 * @param {string} id error id if applicable. Leave as "" or undefined if there is no error
 * @returns
 */
var createMessage = function (message, id) {
    if (id === void 0) { id = ''; }
    var resultJSON = { message: message };
    if (id && id.length > 0)
        resultJSON.id = id;
    return JSON.stringify(resultJSON);
};
var get400 = function (request, response) {
    var message = createMessage('Bad Request', 'badRequest');
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.write(message);
    response.end();
};
exports.get400 = get400;
var get404 = function (request, response) {
    var message = createMessage('404 Page not found', 'pageNotFound');
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(message);
    response.end();
};
exports.get404 = get404;
var get500 = function (request, response) {
    var message = createMessage('Internal Server Error', 'internalServerError');
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.write(message);
    response.end();
};
exports.get500 = get500;
var head400 = function (request, response) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end();
};
exports.head400 = head400;
var head404 = function (request, response) {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end();
};
exports.head404 = head404;
var head500 = function (request, response) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end();
};
exports.head500 = head500;
var getGTFOData = function (request, response, params) {
    if (!params.pathname)
        return get500(request, response);
    var data = gtfoData[params.pathname];
    if (!data)
        return get404(request, response);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(data);
    response.end();
};
exports.getGTFOData = getGTFOData;
var headGTFOData = function (request, response, params) {
    if (!params.pathname)
        return head500(request, response);
    if (!gtfoData[params.pathname])
        return head404(request, response);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
};
exports.headGTFOData = headGTFOData;


/***/ }),

/***/ 997:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var http_1 = __importDefault(__webpack_require__(611));
var contentResponses_1 = __webpack_require__(349);
var dataResponses_1 = __webpack_require__(108);
var port = process.env.PORT || process.env.NODE_PORT || 3000;
var requestHandler = {
    'GET': {
        '/': (0, contentResponses_1.loadContent)('text/html'),
        '/bundle.js': (0, contentResponses_1.loadContent)('text/javascript'),
        '/api/weapons': dataResponses_1.getGTFOData,
        '/api/weapon_stats': dataResponses_1.getGTFOData,
        '/api/categories': dataResponses_1.getGTFOData,
        '/api/strikers': dataResponses_1.getGTFOData,
        'default': dataResponses_1.get404 // 404
    },
    'POST': {
        'default': dataResponses_1.get404 // 404, maybe a different error
    },
    'HEAD': {
        '/api/weapons': dataResponses_1.headGTFOData,
        '/api/weapon_stats': dataResponses_1.headGTFOData,
        '/api/categories': dataResponses_1.headGTFOData,
        '/api/strikers': dataResponses_1.headGTFOData,
        'default': dataResponses_1.head404 // 404 header
    },
    default: { default: dataResponses_1.get404 } // 404
};
var onRequest = function (request, response) {
    var _a, _b;
    var url = new URL(request.url || "/404", "http://".concat(request.headers.host));
    var methodHandler = requestHandler[request.method || "GET"];
    var handler = methodHandler ? methodHandler[url.pathname] : undefined;
    var params = {
        pathname: url.pathname,
        method: request.method,
    };
    // add all search parameters
    url.searchParams.forEach(function (value, key) {
        params[key] = value;
    });
    console.log("Requesting '".concat(url.pathname, "' (").concat(request.method, ")"));
    if (handler)
        handler(request, response, params);
    else
        (_b = (_a = requestHandler.default) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.call(_a, request, response, params);
};
http_1.default.createServer(onRequest).listen(port, function () {
    console.log("Listening to 127.0.0.1:".concat(port));
});


/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 611:
/***/ ((module) => {

module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(997);
/******/ 	
/******/ })()
;