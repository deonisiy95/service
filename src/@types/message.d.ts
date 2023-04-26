import {TRequest, TResponse} from 'src/@types/global';

export type TMessageRaw = Array<{
  key: string;
  value: string;
}>;

export interface IMessage {
  data: TMessageRaw;
  createdAt: number;
  widgetId: string;
}

export type TAddMessageRequest = TRequest<{
  data: TMessageRaw;
}>;

export type TGetMessageListRequest = TRequest<{
  offset: number;
  limit: number;
}>;

export type TGetMessageListResponse = TResponse<{
  messages: Array<IMessage>
}>;
