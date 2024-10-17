import { Logger } from '../shared/libs/logger/index.js';
import { Config, ApplicationSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/models/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoUri } from '../shared/helpers/index.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<ApplicationSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database');
    await this.initDb();
    this.logger.info('Init database completed');
  }

  private async initDb() {
    const mongoUri = getMongoUri(
      this.config.get('DATABASE_HOST'),
      this.config.get('DATABASE_PORT'),
      this.config.get('DATABASE_USER'),
      this.config.get('DATABASE_PASSWORD'),
      this.config.get('DATABASE_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }
}
