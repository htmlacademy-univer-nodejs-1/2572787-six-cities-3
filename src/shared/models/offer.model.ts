import { HousingType } from './housing-type.enum.js';
import { ConvenienceType } from './convenience-type.enum.js';

export type Offer = {
  name: string;
  description: string;
  createdAt: Date;
  city: string;
  previewUrl: string;
  imagesUrls: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: number;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  cost: number;
  conveniences: ConvenienceType[];
  authorUrl: string;
  latitude: number;
  longitude: number;
  commentsNumber: number;
}
