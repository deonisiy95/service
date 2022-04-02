import {TRequest, TResponse} from 'src/@types/global';

interface ITokens {
  accessToken: string,
  refreshToken: string
}

declare namespace NSAuth {
  type TAuthResponse = TResponse<{
    tokens: ITokens
  }>;

  type TAuthRequest = TRequest<{
    refreshToken: string;
  }>;

  type TSignInResponse = TResponse<{
    tokens: ITokens
  }>;

  type TSignInRequest = TRequest<{
    email: string;
    password: string;
  }>;

  type TSignUpResponse = TResponse<{
    tokens: ITokens
  }>;

  type TSignUpRequest = TRequest<{
    name: string;
    email: string;
    password: string;
  }>;
}
