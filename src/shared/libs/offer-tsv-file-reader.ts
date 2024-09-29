import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer } from '../models/index.js';
import { OfferTsvParser } from './offer-tsv-parser.js';

export class OfferTsvFileReader implements FileReader {
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

    const parser = new OfferTsvParser();

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => parser.parse(line));
  }
}
