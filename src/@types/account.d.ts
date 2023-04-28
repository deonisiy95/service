import {TRequest, TResponse} from 'src/@types/global';

export type TFullInfoInResponse = TResponse<{
  account: {
    email: string,
    name: string
  }
}>;

export type TFullInfoInRequest = TRequest<{}>;
