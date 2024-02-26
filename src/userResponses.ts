import { IncomingMessage, ServerResponse } from "http";

interface Comment {
    user?: string;
    body: string;
    likes: number;
    postedDate: number;
    replies: Comment[];
}

const createComment = (
    user = 'Anonymous', 
    body = "", 
    postedDate = Date.now()
    ) => {
    return {
        user,
        body,
        postedDate,
        likes: 0,
        replies: []
    }
}

const comments: Comment[] = [];

const addComment = (request: IncomingMessage, response: ServerResponse) => {
    let data: Buffer;
    request.on('data', (chunk) => {
        data += chunk;
    });
    request.on('end', () => {
        let comment = createComment()
        comments.push(comment);

        response.writeHead(201, {'Content-Type': 'application/json'});
        response.write(comments);
        response.end();
    })
}