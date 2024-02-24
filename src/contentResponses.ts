import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { ResponseHanderParams } from './types';

const readFile = (filepath: string) => fs.readFileSync(`${__dirname}/${filepath}`);

const content: { [path: string]: Buffer | string; } = {
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
const loadContent = (contentType: string) => (request: IncomingMessage, response: ServerResponse, params: ResponseHanderParams) => {
    console.log(`Loading content: ${params.pathname}`)
    const page = content[params.pathname || "default"] || "";
    response.writeHead(200, { 'Content-Type': contentType });
    response.write(page);
    response.end();
    console.log(`Loaded content: ${params.pathname}`)
};

export { loadContent }