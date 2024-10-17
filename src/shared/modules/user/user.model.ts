import { Schema, Document, model } from 'mongoose';
import { User, UserType } from '../../models/index.js';

export interface UserDocument extends User, Document {}

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  type: UserType,
  avatarUrl: String
});

export const UserModel = model<UserDocument>('User', userSchema);
