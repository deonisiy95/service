import mongoose, {Schema, Document} from 'mongoose';

export interface IWidget extends Document {
  name: string,
  token: string,
  userId: string,
  widgetId: string,
}

const widget = new Schema({
  name: String,
  token: String,
  userId: String,
  widgetId: String,
});

export default mongoose.model<IWidget>('Widget', widget);
