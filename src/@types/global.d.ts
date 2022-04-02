import {ParamsDictionary, Query, Send, Response, Request} from 'express-serve-static-core';

export type TRequest<ReqBody> = Request<ParamsDictionary, any, ReqBody, Query> & {
  userId: number;
};

export interface TResponse<ResBody> extends Response {
  json: Send<ResBody | {
    message: string;
  }, this>;
}
