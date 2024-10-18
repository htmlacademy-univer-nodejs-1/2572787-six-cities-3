import { Command } from './command.interface.js';
import { OfferTsvParser } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { TsvFileReader } from '../../shared/libs/file-reader/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { OfferModel, OfferService, DefaultOfferService } from '../../shared/modules/offer/index.js';
import { UserModel, UserService, DefaultUserService } from '../../shared/modules/user/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Offer } from '../../shared/models/index.js';
import { DEFAULT_USER_PASSWORD } from './command.constants.js';

export class ImportCommand implements Command {
  private readonly parser: OfferTsvParser = new OfferTsvParser();
  private readonly userService: UserService;
  private readonly offerService: OfferService;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, database_connection_uri: string, salt: string): Promise<void> {
    this.salt = salt;

    await this.databaseClient.connect(database_connection_uri);
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
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      internalCreatedAt: offer.internalCreatedAt,
      city: offer.city,
      previewUrl: offer.previewUrl,
      imagesUrls: offer.imagesUrls,
      isPremium: offer.isPremium,
      isFavourite: offer.isFavourite,
      rating: offer.rating,
      housingType: offer.housingType,
      roomsNumber: offer.roomsNumber,
      guestsNumber: offer.guestsNumber,
      cost: offer.cost,
      conveniences: offer.conveniences,
      authorId: user.id,
      latitude: offer.latitude,
      longitude: offer.longitude,
      commentsNumber: offer.commentsNumber
    });
  }
}
