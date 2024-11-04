import { UserType } from '../../../models/index.js';

export class CreateUserDto {
  public email: string;
  public avatarUrl?: string;
  public name: string;
  public password: string;
  public type: UserType;
}
