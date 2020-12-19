import mongoose, {Schema, Document}  from 'mongoose';

interface IUser extends Document{
  name: string,
  email: string,
  password: string
}

const user = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String
});

export default mongoose.model<IUser>('User', user);
