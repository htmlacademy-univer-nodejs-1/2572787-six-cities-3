import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer, ConvertToConvenienceType, ConvertToHousingType } from '../models/index.js';

export class TsvFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {

  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([name, description, createdAt, city, previewUrl, imageUrls, isPremium, isFavourite, rating, housingType, roomsNumber, guestsNumber, cost, conveniences, authorUrl, latitude, longitude]) => ({
        name,
        description,
        createdAt: new Date(createdAt),
        city,
        previewUrl,
        imagesUrls: imageUrls.split(';'),
        isPremium: Boolean(isPremium),
        isFavourite: Boolean(isFavourite),
        rating: Number(rating),
        housingType: ConvertToHousingType(housingType),
        roomsNumber: Number(roomsNumber),
        guestsNumber: Number(guestsNumber),
        cost: Number(cost),
        conveniences: conveniences
          .split(';')
          .map((convenience) => ConvertToConvenienceType(convenience)),
        authorUrl,
        latitude: Number(latitude),
        longitude: Number(longitude),
        commentsNumber: 0
      }));
  }
}
