import { config } from 'dotenv';
import { Config } from './config.interface.js';
import { Logger } from '../logger/index.js';
import { ApplicationSchema, configApplicationSchema } from './application.schema.js';

export class ApplicationConfig implements Config<ApplicationSchema> {
  private readonly config: ApplicationSchema

  constructor(
    private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file');
    }

    configApplicationSchema.load(parsedOutput.parsed);
    configApplicationSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configApplicationSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ApplicationSchema>(key: T): ApplicationSchema[T] {
    return this.config[key];
  }
}
