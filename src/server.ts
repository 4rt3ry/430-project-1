import http, { IncomingMessage, ServerResponse } from "http";
import { ResponseHanderParams, ResponseHandlers } from "./types";
import { loadContent, loadImage } from './contentResponses'
import { get404, getGTFOData, head404, headGTFOData } from './dataResponses'
import { getComments, headComments, postComment } from "./commentsResponses";


const port = process.env.PORT || process.env.NODE_PORT || 3000;
const imageExtensions = [".png", ".jpg", ".webp"];

const requestHandler: ResponseHandlers = {
    'GET': {
        '/': loadContent('text/html'),
        '/index.html': loadContent('text/html'),
        '/test-client.html': loadContent('text/html'),
        '/styles/default-styles.css': loadContent('text/css'),
        '/client.bundle.js': loadContent('text/javascript'),
        '/test-client.bundle.js': loadContent('text/javascript'),
        '/comments': getComments,
        '/api/weapons': getGTFOData,
        '/api/main_weapon_stats': getGTFOData,
        '/api/special_weapon_stats': getGTFOData,
        '/api/categories': getGTFOData,
        '/api/enemies': getGTFOData,
        '/api/enemy_stats': getGTFOData,
        'default': get404 // 404
    },
    'POST': {
        '/add_comment': postComment,
        'default': get404 // 404, maybe a different error
    },
    'HEAD': {
        '/api/weapons': headGTFOData,
        '/api/main_weapon_stats': headGTFOData,
        '/api/special_weapon_stats': headGTFOData,
        '/api/categories': headGTFOData,
        '/api/enemies': headGTFOData,
        '/api/enemy_stats': headGTFOData,
        'comments': headComments,
        'default': head404 // 404 header
    },
    default: { default: get404 } // 404
}

const onRequest = (request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url || "/404", `http://${request.headers.host}`);
    const methodHandler = requestHandler[request.method || "GET"];
    // console.log(url.pathname);

    let handler = undefined;

    if (methodHandler) handler = methodHandler[url.pathname];
    if (imageExtensions.some(ext => url.pathname.endsWith(ext))) {
        handler = loadImage('image/png');
    }


    // Add parameters to the response handler
    const params: ResponseHanderParams = {
        pathname: url.pathname,
        method: request.method,
    };
    // add all search parameters
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    // console.log(`Requesting '${url.pathname}' (${request.method})`);


    if (handler) handler(request, response, params);
    else requestHandler.default?.default?.(request, response, params);

}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening to 127.0.0.1:${port}`);
});