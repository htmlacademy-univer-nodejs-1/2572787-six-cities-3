import { UserType } from './user-type.enum.js';

export type User = {
  name: string;
  email: string;
  password?: string;
  type: UserType;
  avatarUrl?: string;
}
