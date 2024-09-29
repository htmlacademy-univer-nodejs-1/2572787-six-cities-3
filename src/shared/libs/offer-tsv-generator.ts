import { Generator } from './generator.interface.js';
import { City, ConvenienceType, HousingType, MockServerData } from '../models/index.js';
import { generateRandomValue, getRandomItem, generateRandomBoolean, getRandomEnumValue, getRandomEnumValues } from '../helpers/index.js';
import dayjs from 'dayjs';

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

export class OfferTsvGenerator implements Generator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const name = getRandomItem(this.mockData.names);
    const description = getRandomItem(this.mockData.descriptions);

    const createdAt = dayjs()
      .subtract(generateRandomValue(MIN_DAY_OFFSET, MAX_DAY_OFFSET))
      .toISOString();

    const city = getRandomEnumValue(City);

    const offerId = generateRandomValue(MIN_OFFER_ID, MAX_OFFER_ID);
    const previewUrl = `https://six-cities.ru/images/${offerId}/0`;
    const imagesUrls = [
      `https://six-cities.ru/images/${offerId}/1`,
      `https://six-cities.ru/images/${offerId}/2`,
      `https://six-cities.ru/images/${offerId}/3`,
      `https://six-cities.ru/images/${offerId}/4`,
      `https://six-cities.ru/images/${offerId}/5`,
      `https://six-cities.ru/images/${offerId}/6`
    ].join(';');

    const isPremium = generateRandomBoolean();
    const isFavourite = generateRandomBoolean();

    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const housingType = getRandomEnumValue(HousingType);

    const roomsNumber = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guestsNumber = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const cost = generateRandomValue(MIN_COST, MAX_COST, 2);
    const conveniences = getRandomEnumValues(ConvenienceType).join(';');

    const author = getRandomItem(this.mockData.authors);
    const authorUrl = `https://six-cities/users/${author}`;

    const latitude = generateRandomValue(0, 90, 6);
    const longitude = generateRandomValue(0, 180, 6);

    return [
      name, description, createdAt, city,
      previewUrl, imagesUrls, isPremium, isFavourite,
      rating, housingType, roomsNumber, guestsNumber,
      cost, conveniences, authorUrl, latitude, longitude
    ].join('\t');
  }
}
