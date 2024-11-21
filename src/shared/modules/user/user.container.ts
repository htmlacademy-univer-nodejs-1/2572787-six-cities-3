import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Component } from '../../models/index.js';
import { DefaultUserService } from './default.user-service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { UserController } from './user-controller.js';
import { Controller } from '../../libs/rest/controller.interface.js';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return container;
}
