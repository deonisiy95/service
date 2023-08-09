import {TRequest, TResponse} from 'src/@types/global';

export type TLabelForm = {
  text?: string;
  color: string;
  icon: string;
}

export interface IForm {
  widgetId: string;
  config: string;
  label: TLabelForm
}

export type TUpdateFormRequest = TRequest<{
  config: string;
  label: TLabelForm;
}>;

export type TUpdateFormResponse = TResponse<{}>;
