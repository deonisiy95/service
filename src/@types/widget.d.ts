import {TRequest, TResponse} from 'src/@types/global';
import {IWidget} from 'models/widget';

export type TGetWidgetsResponse = TResponse<Array<IWidget>>;

export type TGetWidgetRequest = TRequest<{}>;

export type TCreateWidgetsRequest = TRequest<{
  name: string,
  token: string,
  agents?: IWidget['agents']
}>;

export type TCreateWidgetResponse = TResponse<Partial<IWidget>>;

export type TCheckRequest = TRequest<{
  name: string,
  token: string
}>;

export type TCheckResponse = TResponse<{agents: IWidget['agents']}>;

export type TSetAgentsRequest = TRequest<{
  name: string,
  token: string
}>;

export type TSetAgentsResponse = TResponse<Partial<IWidget>>;
