import { Ref } from '@typegoose/typegoose';
import { HousingType, ConvenienceType, City } from '../../../models/index.js';
import { UserEntity } from '../../user/user.entity.js';

export class CreateOfferDto {
  public name: string;
  public description: string;
  public internalCreatedAt: Date;
  public city: City;
  public previewUrl: string;
  public imagesUrls: string[];
  public isPremium: boolean;
  public isFavourite: boolean;
  public rating: number;
  public housingType: HousingType;
  public roomsNumber: number;
  public guestsNumber: number;
  public cost: number;
  public conveniences: ConvenienceType[];
  public authorId: Ref<UserEntity>;
  public latitude: number;
  public longitude: number;
  public commentsNumber: number;
}
