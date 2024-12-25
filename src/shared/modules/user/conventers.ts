import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../models/user.model.js';
import { UserEntity } from './user.entity.js';

export function toFullModel(dbModel: DocumentType<UserEntity>, host: string): User {
  return {
    id: dbModel._id.toString(),
    name: dbModel.name,
    avatar: `${host}/${dbModel.avatar}`,
    type: dbModel.type,
    email: dbModel.email
  };
}
