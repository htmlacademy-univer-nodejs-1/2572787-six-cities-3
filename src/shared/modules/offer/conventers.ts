import { DocumentType } from '@typegoose/typegoose';
import { Offer } from '../../models/offer.model.js';
import { OfferEntity } from './offer.entity.js';
import { OfferShort } from '../../models/offer-short.model.js';
import { UserEntity } from '../user/user.entity.js';
import { toFullModel as toFullUserModel } from '../user/conventers.js';

export function toFullModel(dbModel: DocumentType<OfferEntity>, userId: string, author: DocumentType<UserEntity>, host: string): Offer {
  return {
    id: dbModel._id.toString(),
    name: dbModel.name,
    description: dbModel.description,
    createdAt: dbModel.createdAt!,
    city: dbModel.city,
    previewUrl: dbModel.previewUrl,
    imagesUrls: dbModel.imagesUrls,
    isPremium: dbModel.isPremium,
    isFavourite: dbModel.favouriteUsers.map((u) => u.toString()).includes(userId),
    rating: dbModel.rating,
    housingType: dbModel.housingType,
    roomsNumber: dbModel.roomsNumber,
    guestsNumber: dbModel.guestsNumber,
    cost: dbModel.cost,
    conveniences: dbModel.conveniences,
    author: toFullUserModel(author, host),
    latitude: dbModel.latitude,
    longitude: dbModel.longitude,
    commentsNumber: dbModel.commentsNumber
  };
}

export function toShortModel(dbModel: DocumentType<OfferEntity>, userId: string): OfferShort {
  return {
    id: dbModel._id.toString(),
    name: dbModel.name,
    createdAt: dbModel.createdAt!,
    city: dbModel.city,
    previewUrl: dbModel.previewUrl,
    isPremium: dbModel.isPremium,
    isFavourite: dbModel.favouriteUsers.map((u) => u.toString()).includes(userId),
    rating: dbModel.rating,
    housingType: dbModel.housingType,
    cost: dbModel.cost,
    commentsNumber: dbModel.commentsNumber
  };
}
