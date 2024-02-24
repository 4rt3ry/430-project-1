
export interface ResponseHandlers {
    [key: string]: ResponseHandler | undefined;
    // default: ResponseHandler;
}

export interface ResponseHandler {
    [key: string]: Function | undefined;
}

export interface ResponseHanderParams {
    [key: string]: string | undefined;
}