import { City, ConvenienceType, HousingType, Offer } from '../../models/index.js';
import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
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

  @prop({ required: true })
  authorUrl: string;

  @prop({ required: true })
  latitude: number;

  @prop({ required: true })
  longitude: number;

  @prop({ required: true })
  commentsNumber: number;

  constructor(offer: Offer) {
    super();

    this.name = offer.name;
    this.description = offer.description;
    this.internalCreatedAt = offer.internalCreatedAt;
    this.city = offer.city;
    this.previewUrl = offer.previewUrl;
    this.imagesUrls = offer.imagesUrls;
    this.isPremium = offer.isPremium;
    this.isFavourite = offer.isFavourite;
    this.rating = offer.rating;
    this.housingType = offer.housingType;
    this.roomsNumber = offer.roomsNumber;
    this.guestsNumber = offer.guestsNumber;
    this.cost = offer.cost;
    this.conveniences = offer.conveniences;
    this.authorUrl = offer.authorUrl;
    this.latitude = offer.latitude;
    this.longitude = offer.longitude;
    this.commentsNumber = offer.commentsNumber;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
