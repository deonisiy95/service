import {ParamsDictionary, Query, Send, Response, Request} from 'express-serve-static-core';

export type TRequest<ReqBody> = Request<ParamsDictionary, any, ReqBody, Query> & {
  userId?: number;
};

export interface TResponse<ResBody> extends Response {
  json: Send<ResBody | {
    ok?: boolean;
    message?: string;
  }, this>;
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
