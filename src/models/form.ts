import mongoose, {Schema, Document} from 'mongoose';

export interface IForm {
  widgetId: string;
  config: string;
}

export interface IFormDoc extends IForm, Document {}

const form = new Schema({
  widgetId: String,
  config: String,
});

export default mongoose.model<IFormDoc>('Form', form);
