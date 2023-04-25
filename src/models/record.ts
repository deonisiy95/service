import mongoose, {Schema, Document} from 'mongoose';
import {IRecord} from 'src/@types/record';

export interface IRecordDoc extends IRecord, Document {}

const recordData = new Schema({
  key: String,
  value: String
});

const record = new Schema({
  data: [recordData],
  createdAt: Number,
  widgetId: String
});

export default mongoose.model<IRecordDoc>('Record', record);
