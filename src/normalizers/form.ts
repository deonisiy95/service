import {IFormDoc} from 'models/form';
import {IForm} from 'src/@types/form';

export default function(form: IFormDoc): IForm {
  return {
    widgetId: form.widgetId,
    config: form.config
  };
}
