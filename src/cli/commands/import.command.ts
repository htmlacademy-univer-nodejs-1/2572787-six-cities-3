import { Command } from './command.interface.js';
import { OfferTsvParser } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { TsvFileReader } from '../../shared/libs/file-reader/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { OfferModel, OfferService, DefaultOfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Offer } from '../../shared/models/index.js';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { DefaultUserService } from '../../shared/modules/user/default.user-service.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';

export class ImportCommand implements Command {
  private readonly parser: OfferTsvParser = new OfferTsvParser();
  private readonly offerService: OfferService;
  private readonly userService: UserService;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
    this.saveOffer = this.saveOffer.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel, CommentModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, databaseConnectionUri: string, salt: string): Promise<void> {
    this.salt = salt;

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
    const result = await this.userService.create({
      email: offer.author.email,
      password: '1234567890',
      type: offer.author.type,
      name: offer.author.name
    }, this.salt);

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
      latitude: offer.latitude,
      longitude: offer.longitude
    }, result.id);
  }
}
