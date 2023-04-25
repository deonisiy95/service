import {TRequest} from 'src/@types/global';

export type TRecordRaw = Array<{
  key: string;
  value: string;
}>;

export interface IRecord {
  data: TRecordRaw;
  createdAt: number;
  widgetId: string;
}

export type TAddRecordRequest = TRequest<{
  data: TRecordRaw;
}>;
