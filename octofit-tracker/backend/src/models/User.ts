import { model, Schema } from 'mongoose';

export interface User {
  name: string;
  email: string;
  username: string;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true },
);

export default model<User>('User', userSchema);
