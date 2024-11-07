import { UUID } from 'node:crypto';
import { HousingType, ConvenienceType, City } from '../../../models/index.js';

export class PutOfferDto {
  public id: UUID;
  public name: string;
  public description: string;
  public city: City;
  public previewUrl: string;
  public imagesUrls: string[];
  public rating: number;
  public isPremium: boolean;
  public isFavourite: boolean;
  public housingType: HousingType;
  public roomsNumber: number;
  public guestsNumber: number;
  public cost: number;
  public conveniences: ConvenienceType[];
  public latitude: number;
  public longitude: number;
}
