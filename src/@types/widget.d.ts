import {TRequest, TResponse} from 'src/@types/global';
import {IWidget} from 'models/widget';

export type TGetWidgetsResponse = TResponse<Array<IWidget>>;

export type TGetWidgetRequest = TRequest<{}>;

export type TCreateWidgetsRequest = TRequest<{
  name: string,
  token: string
}>;

export type TCreateWidgetResponse = TResponse<Partial<IWidget>>;
