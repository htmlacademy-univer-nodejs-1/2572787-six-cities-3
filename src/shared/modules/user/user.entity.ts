import { User, UserType } from "../../models/index.js";
import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { createSHA256 } from "../../helpers/index.js";

export interface UserEntity extends defaultClasses.Base {};

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true })
  public name = '';

  @prop({ required: true, unique: true })
  public email = '';

  @prop({ required: true })
  public password? = '';

  @prop({ required: true })
  public type = UserType.Basic;

  @prop({ required: false, default: null })
  public avatarUrl? = '';

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
