import { City, ConvenienceType, HousingType, } from '../../models/index.js';
import { getModelForClass, prop, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  name: string;

  @prop()
  description: string;

  @prop({ required: true })
  internalCreatedAt: Date;

  @prop({ required: true })
  city: City;

  @prop({ required: true })
  previewUrl: string;

  @prop({ required: false })
  imagesUrls: string[];

  @prop({ required: true })
  isPremium: boolean;

  @prop({ required: true })
  isFavourite: boolean;

  @prop({ required: true })
  rating: number;

  @prop({ required: true })
  housingType: HousingType;

  @prop({ required: true })
  roomsNumber: number;

  @prop({ required: true })
  guestsNumber: number;

  @prop({ required: true })
  cost: number;

  @prop({ required: true })
  conveniences: ConvenienceType[];

  @prop({ required: true, ref: UserEntity })
  authorId: Ref<UserEntity>;

  @prop({ required: true })
  latitude: number;

  @prop({ required: true })
  longitude: number;

  @prop({ required: true })
  commentsNumber: number;
}

export const OfferModel = getModelForClass(OfferEntity);
