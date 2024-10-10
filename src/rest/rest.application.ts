import { Logger } from '../shared/libs/logger/index.js';
import { Config } from '../shared/libs/config/index.js';
import { ApplicationSchema } from '../shared/libs/config/index.js';

export class Application {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config<ApplicationSchema>
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`)
  }
}
