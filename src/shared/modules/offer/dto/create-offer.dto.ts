import { HousingType, ConvenienceType, City } from '../../../models/index.js';
import { Types } from 'mongoose';

export class CreateOfferDto {
  public name: string;
  public description: string;
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
  public authorId: Types.ObjectId;
  public latitude: number;
  public longitude: number;
  public commentsNumber: number;
}
