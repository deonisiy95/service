import mongoose, {Schema, Document} from 'mongoose';
import {IForm} from 'src/@types/form';

export interface IFormDoc extends IForm, Document {}

const form = new Schema({
  widgetId: String,
  config: String,
  label: {
    text: String,
    icon: String,
    color: String
  }
});

export default mongoose.model<IFormDoc>('Form', form);
