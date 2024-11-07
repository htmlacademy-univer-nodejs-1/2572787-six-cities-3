import { Container } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../models/index.js';
import { DefaultCommentService } from './default.comment-service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { types } from '@typegoose/typegoose';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return container;
}
