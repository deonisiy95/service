import mongoose, {Schema, Document} from 'mongoose';

interface IOrder extends Document{
  name: string,
  details: string,
  broadcasting: boolean,
  userId: string
}

const order = new Schema({
  name: String,
  details: String,
  broadcasting: Boolean,
  userId: String
});

export default mongoose.model<IOrder>('Order', order);
