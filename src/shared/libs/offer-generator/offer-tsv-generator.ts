import { Generator } from './generator.interface.js';
import { City, ConvenienceType, HousingType, MockServerData, UserType } from '../../models/index.js';
import { generateRandomValue, getRandomItem, generateRandomBoolean, getRandomEnumValue, getRandomEnumValues } from '../../helpers/index.js';
import dayjs from 'dayjs';
import { OfferTsvParser } from './offer-tsv-parser.js';

const MIN_DAY_OFFSET = 0;
const MAX_DAY_OFFSET = 14;

const MIN_OFFER_ID = 0;
const MAX_OFFER_ID = 99999;

const MIN_RATING = 1.0;
const MAX_RATING = 5.0;

const MIN_ROOMS = 1;
const MAX_ROOMS = 6;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_COST = 1_000;
const MAX_COST = 500_000;

const MIN_EMAIL_ID = 0;
const MAX_EMAIL_ID = 500_000;

const MIN_LATITUDE = 0;
const MAX_LATITUDE = 90;

const MIN_LONGITUDE = 0;
const MAX_LONGITUDE = 180;

export class OfferTsvGenerator implements Generator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const offerId = generateRandomValue(MIN_OFFER_ID, MAX_OFFER_ID);
    const author = getRandomItem(this.mockData.authors);

    const offer = {
      name: getRandomItem(this.mockData.names),
      description: getRandomItem(this.mockData.descriptions),
      internalCreatedAt: dayjs()
        .subtract(generateRandomValue(MIN_DAY_OFFSET, MAX_DAY_OFFSET))
        .toDate(),
      city: getRandomEnumValue(City),
      previewUrl: `https://six-cities.ru/images/${offerId}/0`,
      imagesUrls: [
        `https://six-cities.ru/images/${offerId}/1`,
        `https://six-cities.ru/images/${offerId}/2`,
        `https://six-cities.ru/images/${offerId}/3`,
        `https://six-cities.ru/images/${offerId}/4`,
        `https://six-cities.ru/images/${offerId}/5`,
        `https://six-cities.ru/images/${offerId}/6`
      ],
      isPremium: generateRandomBoolean(),
      isFavourite: generateRandomBoolean(),
      rating: generateRandomValue(MIN_RATING, MAX_RATING, 1),
      housingType: getRandomEnumValue(HousingType),
      roomsNumber: generateRandomValue(MIN_ROOMS, MAX_ROOMS),
      guestsNumber: generateRandomValue(MIN_GUESTS, MAX_GUESTS),
      cost: generateRandomValue(MIN_COST, MAX_COST, 2),
      conveniences: getRandomEnumValues(ConvenienceType),
      author: {
        email: `${author}${generateRandomValue(MIN_EMAIL_ID, MAX_EMAIL_ID)}@aboba.ru`,
        name: author,
        type: UserType.Basic,
        avatarUrl: `http://localhost:1111/${author}`
      },
      latitude: generateRandomValue(MIN_LATITUDE, MAX_LATITUDE, 6),
      longitude: generateRandomValue(MIN_LONGITUDE, MAX_LONGITUDE, 6),
      commentsNumber: 0
    };
    const parser = new OfferTsvParser();

    return parser.toString(offer);
  }
}
