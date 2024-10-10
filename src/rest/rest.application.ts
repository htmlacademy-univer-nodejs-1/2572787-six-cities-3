import { Logger } from '../shared/libs/logger/index.js';
import { Config, ApplicationSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/models/component.enum.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Looger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<ApplicationSchema>
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`)
  }
}
