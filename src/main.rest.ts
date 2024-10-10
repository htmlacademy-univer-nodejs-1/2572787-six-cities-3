import { PinoLogger } from './shared/libs/logger/index.js';
import { Application } from './rest/index.js';
import { ApplicationConfig } from './shared/libs/config/application.config.js';

async function bootstrap() {
  const logger = new PinoLogger();
  const config = new ApplicationConfig(logger);

  const application = new Application(logger, config);
  await application.init();
}

bootstrap();
