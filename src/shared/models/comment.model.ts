import { User } from './user.model.js';

export type Comment = {
  id: string,
  text: string;
  createdAt: Date;
  rating: number;
  author: User;
}
