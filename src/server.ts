import http, { IncomingMessage, ServerResponse } from "http";
import { ResponseHanderParams, ResponseHandlers } from "./types";
import { loadContent } from './contentResponses'
import { get404, getGTFOData, head404, headGTFOData } from './dataResponses'
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const requestHandler: ResponseHandlers = {
    'GET': {
        '/': loadContent('text/html'),
        '/bundle.js': loadContent('text/javascript'),
        '/api/weapons': getGTFOData,
        '/api/weapon_stats': getGTFOData,
        '/api/categories': getGTFOData,
        '/api/enemies': getGTFOData,
        '/api/enemy_stats': getGTFOData,
        'default': get404 // 404
    },
    'POST': {
        'default': get404 // 404, maybe a different error
    },
    'HEAD': {
        '/api/weapons': headGTFOData,
        '/api/weapon_stats': headGTFOData,
        '/api/categories': headGTFOData,
        '/api/enemies': headGTFOData,
        '/api/enemy_stats': headGTFOData,
        'default': head404 // 404 header
    },
    default: { default: get404 } // 404
}

const onRequest = (request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url || "/404", `http://${request.headers.host}`);
    const methodHandler = requestHandler[request.method || "GET"];
    console.log(url.pathname);
    const handler = methodHandler ? methodHandler[url.pathname] : undefined;

    const params: ResponseHanderParams = {
        pathname: url.pathname,
        method: request.method,
    };
    // add all search parameters
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    console.log(`Requesting '${url.pathname}' (${request.method})`);

    if (handler) handler(request, response, params);
    else requestHandler.default?.default?.(request, response, params);

}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening to 127.0.0.1:${port}`);
});