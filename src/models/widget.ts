import mongoose, {Schema, Document} from 'mongoose';

export interface IWidget extends Document {
  name: string,
  token: string,
  userId: string,
  widgetId: string,
  agents: Array<{
    id: number,
    name: string,
    username: string
  }>
}

const widget = new Schema({
  name: String,
  token: String,
  userId: String,
  widgetId: String,
  agents: [{
    id: Number,
    name: String,
    username: String
  }],
});

export default mongoose.model<IWidget>('Widget', widget);
