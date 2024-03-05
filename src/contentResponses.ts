import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { ResponseHanderParams } from './types';

const readFile = (filepath: string) => fs.readFileSync(`${__dirname}/${filepath}`);

const content: { [path: string]: Buffer | string; } = {
    '/': readFile('../hosted/index.html'),
    '/index.html': readFile('../hosted/index.html'),
    '/test-client.html': readFile('../hosted/test-client.html'),
    '/styles/default-styles.css': readFile('../hosted/styles/default-styles.css'),
    '/client.bundle.js': readFile('../hosted/client.bundle.js'),
    '/test-client.bundle.js': readFile('../hosted/test-client.bundle.js'),
    '/media/background_1.png': readFile('../media/background_1.png'),
    default: '',
};

/**
 * Retrieve any image under the root directory
 */
const loadImage = (contentType: string) => (request: IncomingMessage, response: ServerResponse, params: ResponseHanderParams) => {
    // console.log(`Loading content: ${params.pathname}`);
    let image: Buffer;
    try {
        // ../media/*
        image = readFile(".." + (params.pathname ?? ""));
    }
    catch {
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200, { 'Content-Type': contentType });
    response.write(image);
    response.end();

}

/**
 * Retrieve content from the server
 * @param {*} params { pathName: '/hosted.html' }
 */
const loadContent = (contentType: string) => (request: IncomingMessage, response: ServerResponse, params: ResponseHanderParams) => {
    // console.log(`Loading content: ${params.pathname}`)
    const page = content[params.pathname || "default"] || "";
    response.writeHead(200, { 'Content-Type': contentType });
    response.write(page);
    response.end();
};

export { loadContent, loadImage }