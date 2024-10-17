import { UserType } from "../../../models/index.js";

export class CreateUserDto {
  public email: string;
  public avatarPath: string;
  public name: string;
  public password: string;
  public userType: UserType;
}
