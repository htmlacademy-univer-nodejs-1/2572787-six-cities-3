import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../models/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
