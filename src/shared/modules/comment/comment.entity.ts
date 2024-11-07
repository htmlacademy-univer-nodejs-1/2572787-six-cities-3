import { UUID } from 'node:crypto';
import { Comment, User } from '../../models/index.js';
import { Ref, getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base<UUID> {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text: string;

  @prop({required: true})
  public rating: number;

  @prop({required: true})
  public authorId: UUID;

  @prop({required: true})
  public offerId: UUID;
}

export const CommentModel = getModelForClass(CommentEntity);
