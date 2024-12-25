import { UserType } from './user-type.enum.js';

export type User = {
  id: string,
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
}
