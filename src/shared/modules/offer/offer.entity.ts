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
  public name: string;

  @prop()
  public description: string;

  @prop({ required: true })
  public city: City;

  @prop({ required: true })
  public previewUrl: string;

  @prop({ required: false })
  public imagesUrls: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true, default: 0 })
  public rating: number;

  @prop({ required: true })
  public housingType: HousingType;

  @prop({ required: true })
  public roomsNumber: number;

  @prop({ required: true })
  public guestsNumber: number;

  @prop({ required: true })
  public cost: number;

  @prop({ required: true })
  public conveniences: ConvenienceType[];

  @prop({ required: true })
  public authorId: Ref<UserEntity>;

  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;

  @prop({ required: true, default: 0 })
  public commentsNumber: number;

  @prop({ required: true })
  public favouriteUsers: Ref<UserEntity>[] = [];
}

export const OfferModel = getModelForClass(OfferEntity);
