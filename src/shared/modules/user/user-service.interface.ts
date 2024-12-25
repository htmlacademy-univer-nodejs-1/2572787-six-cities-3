import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Types } from 'mongoose';
import { CheckIdService } from '../../libs/rest/check-id-service.interface.js';

export interface UserService extends CheckIdService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  checkPassword(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null>;
  updateAvatar(id: Types.ObjectId, avatarPath: string): Promise<void>;
}
