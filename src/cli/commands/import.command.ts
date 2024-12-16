import { Command } from './command.interface.js';
import { OfferTsvParser } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { TsvFileReader } from '../../shared/libs/file-reader/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { OfferModel, OfferService, DefaultOfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Offer } from '../../shared/models/index.js';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';

export class ImportCommand implements Command {
  private readonly parser: OfferTsvParser = new OfferTsvParser();
  private readonly offerService: OfferService;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: Logger;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel, CommentModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, databaseConnectionUri: string): Promise<void> {
    await this.databaseClient.connect(databaseConnectionUri);
    const reader = new TsvFileReader(filename.trim());

    reader.on('line', this.onImportedLine);
    reader.on('end', this.onCompleteImport);

    try {
      await reader.read();
    } catch (error: unknown) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${getErrorMessage(error)}`);
    }
  }

  private async onImportedLine(importedLine: string, resolve: () => void): Promise<void> {
    const offer = this.parser.parse(importedLine);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(importedRowCount: number) {
    console.log(`Imported ${importedRowCount} rows`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      city: offer.city,
      previewUrl: offer.previewUrl,
      imagesUrls: offer.imagesUrls,
      isPremium: offer.isPremium,
      housingType: offer.housingType,
      roomsNumber: offer.roomsNumber,
      guestsNumber: offer.guestsNumber,
      cost: offer.cost,
      conveniences: offer.conveniences,
      authorId: offer.author,
      latitude: offer.latitude,
      longitude: offer.longitude
    });
  }
}
