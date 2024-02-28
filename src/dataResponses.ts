import { IncomingMessage, ServerResponse } from "http"
import fs from 'fs'
import { ResponseHanderParams } from "./types";
const readFile = (filepath: string) => fs.readFileSync(`${__dirname}/${filepath}`);

const gtfoData: { [key: string]: Buffer | string } = {
    '/api/weapons': readFile('../data/weapons.json'),
    '/api/weapon_stats': readFile('../data/weapon_stats.json'),
    '/api/categories': readFile('../data/categories.json'),
    '/api/enemies': readFile('../data/enemies.json'),
    '/api/enemy_stats': readFile('../data/enemy_stats.json'),
}

/**
 * Builds a message response in json or xml format (decided by the accept header)
 * @param {string} message message
 * @param {string} id error id if applicable. Leave as "" or undefined if there is no error
 * @returns
 */
const createMessage = (message: string, id: string = ''): string => {
    const resultJSON: { [key: string]: string } = { message };
    if (id && id.length > 0) resultJSON.id = id;

    return JSON.stringify(resultJSON);
}

const get400 = (request: IncomingMessage, response: ServerResponse) => {
    const message = createMessage('Bad Request', 'badRequest');
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.write(message);
    response.end();
}

const get404 = (request: IncomingMessage, response: ServerResponse) => {
    const message = createMessage('404 Page not found', 'pageNotFound');
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(message);
    response.end();
}

const get500 = (request: IncomingMessage, response: ServerResponse) => {
    const message = createMessage('Internal Server Error', 'internalServerError');
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.write(message);
    response.end();
}

const head400 = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end();
}

const head404 = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end();
}

const head500 = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end();
}

const getGTFOData = (request: IncomingMessage, response: ServerResponse, params: ResponseHanderParams) => {
    if (!params.pathname) return get500(request, response);
    const data = gtfoData[params.pathname];

    if (!data) return get404(request, response);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(data);
    response.end();

}
const headGTFOData = (request: IncomingMessage, response: ServerResponse, params: ResponseHanderParams) => {
    if (!params.pathname) return head500(request, response);
    if (!gtfoData[params.pathname]) return head404(request, response);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
}

export { get400, get404, get500, head400, head404, head500, getGTFOData, headGTFOData }