import { Offer, HousingType, ConvenienceType, City } from '../../models/index.js';

export class OfferTsvParser {
  constructor() {}

  parse(rawString: string): Offer {
    const trimString = rawString.trim();

    if (!trimString) {
      throw new Error('rawString should not be empty');
    }

    const splitString = trimString.split('\t');
    const [name, description, createdAt, city, previewUrl, imageUrls, isPremium, isFavourite, rating, housingType, roomsNumber, guestsNumber, cost, conveniences, authorUrl, latitude, longitude] = splitString;

    return {
      name,
      description,
      internalCreatedAt: new Date(createdAt),
      city: city as City,
      previewUrl,
      imagesUrls: imageUrls.split(';'),
      isPremium: Boolean(isPremium),
      isFavourite: Boolean(isFavourite),
      rating: Number(rating),
      housingType: housingType as HousingType,
      roomsNumber: Number(roomsNumber),
      guestsNumber: Number(guestsNumber),
      cost: Number(cost),
      conveniences: conveniences
        .split(';')
        .map((convenience) => convenience as ConvenienceType),
      authorUrl,
      latitude: Number(latitude),
      longitude: Number(longitude),
      commentsNumber: 0
    };
  }

  toString(offer: Offer): string {
    return [
      offer.name, offer.description, offer.internalCreatedAt, offer.city,
      offer.previewUrl, offer.imagesUrls.join(';'), offer.isPremium, offer.isFavourite,
      offer.rating, offer.housingType, offer.roomsNumber, offer.guestsNumber,
      offer.cost, offer.conveniences.join(';'), offer.authorUrl, offer.latitude, offer.longitude
    ].join('\t');
  }
}
