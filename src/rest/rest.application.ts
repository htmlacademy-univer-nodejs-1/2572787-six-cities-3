import { Logger } from '../shared/libs/logger/index.js';
import { Config, ApplicationSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/models/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoUri } from '../shared/helpers/index.js';
import express from 'express';
import { Controller } from '../shared/libs/rest/controller.interface.js';
import { ExceptionFilter } from '../shared/libs/exception-filter/exception-filter.interface.js';
import cors from 'cors';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<ApplicationSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database');
    await this.initDb();
    this.logger.info('Init database completed');

    const app = express();

    this.configureMiddlewares(app);

    app.use('/users', this.userController.router);
    app.use('/offers', this.offerController.router);
    app.use('/offers', this.commentController.router);

    app.use(this.exceptionFilter.handle.bind(this.exceptionFilter));

    app.listen(this.config.get('PORT'),
      () => this.logger.info(`Server running on port: ${this.config.get('PORT')}`)
    );
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

  private async configureMiddlewares(app: express.Application) {
    app.use(express.json());
    app.use(express.static(this.config.get('STATIC_ROOT')));
    app.use(cors())
    app.use((req, _res, next) => {
      this.logger.info(`Catch request: ${req.method} ${req.url}`);
      next();
    });
  }
}
