import { IncomingMessage, ServerResponse } from "http";
import { Comment } from "../interfaces";
import { createMessage, get400, head400 } from "./dataResponses";

const comments: Comment[] = [];

/**
 * Post a comment to the server
 * @param request 
 * @param response 
 * @returns 
 */
const postComment = (request: IncomingMessage, response: ServerResponse) => {
    if (request.method !== 'POST') {
        return request.method === 'HEAD' ?
            head400(request, response) :
            get400(request, response);
    } else {
        let body = '';
        request.on('data', (data) => {
            body += data;
        });

        request.on('end', () => {
            let status = 201;
            let message = 'comment success';
            const comment = JSON.parse(body).comment as Comment;
            if (comment.author === undefined || comment.date === undefined || comment.text === undefined) {
                status = 400;
                message = "Comment must contain properties {author, date, text}";
            }

            comments.push(comment);
            response.writeHead(status, { 'Content-Type': 'application/json' });
            response.write(createMessage(message));
            response.end();
        });
    }
};

/**
 * Return an array of all comments
 * @param request 
 * @param response 
 */
const getComments = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(comments));
    response.end();
}

/**
 * Return an array of all comments
 * @param request 
 * @param response 
 */
const headComments = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
}

export { postComment, getComments, headComments }