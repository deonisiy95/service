import {TRequest, TResponse} from 'src/@types/global';

export interface IForm {
  widgetId: string;
  config: string;
}

export type TUpdateFormRequest = TRequest<{
  config: string;
}>;

export type TUpdateFormResponse = TResponse<{}>;
