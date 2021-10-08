import {Request, Response} from 'express';
import {ParamsDictionary, Query} from 'express-serve-static-core';

type TRequest<TBody> = Request<ParamsDictionary, any, TBody, Query>;

interface ITokens {
  accessToken: string,
  refreshToken: string
}


declare namespace NSAuth {
  type TAuthResponse = Response<{
    tokens: ITokens
  } | {
    message: string
  }>;

  type TAuthRequest = TRequest<{
    refreshToken: string;
  }>;

  type TSignInResponse = Response<{
    tokens: ITokens
  } | {
    message: string
  }>;

  type TSignInRequest = TRequest<{
    email: string;
    password: string;
  }>;

  type TSignUpResponse = Response<{
    tokens: ITokens
  } | {
    message: string
  }>;

  type TSignUpRequest = TRequest<{
    name: string;
    email: string;
    password: string;
  }>;
}
