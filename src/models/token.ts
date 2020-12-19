import mongoose, {Schema, Document} from 'mongoose';

export interface IToken extends Document{
  tokenId: string,
  userId: string
}

const token = new Schema({
  tokenId: String,
  userId: String
});

export default mongoose.model<IToken>('Token', token);
