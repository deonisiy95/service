import mongoose, {Schema, Document} from 'mongoose';
import {IMessage} from 'src/@types/message';

export interface IMessageDoc extends IMessage, Document {}

const messageData = new Schema({
  key: String,
  value: String
});

const message = new Schema({
  data: [messageData],
  createdAt: Number,
  widgetId: String
});

export default mongoose.model<IMessageDoc>('Message', message);
