import mongoose, {Schema, Document} from 'mongoose';

export interface IToken extends Document {
  tokenId: string,
  userId: number
}

const token = new Schema({
  tokenId: String,
  userId: String
});

export default mongoose.model<IToken>('Token', token);
