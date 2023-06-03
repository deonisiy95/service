import mongoose, {Schema, Document} from 'mongoose';

export interface IWidget {
  name: string;
  token: string;
  userId: string;
  widgetId: string;
  agents: Array<{
    id: number;
    name: string;
    username: string;
  }>;
}

export interface IWidgetDoc extends IWidget, Document {}

const widget = new Schema({
  name: String,
  token: String,
  userId: String,
  widgetId: String,
  agents: [
    {
      id: Number,
      name: String,
      username: String
    }
  ]
});

widget.index({widgetId: 1});

export default mongoose.model<IWidgetDoc>('Widget', widget);
