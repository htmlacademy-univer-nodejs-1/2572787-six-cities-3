import { PinoLogger } from './shared/libs/logger/index.js';
import { Application } from './rest/index.js';

async function bootstrap() {
  const logger = new PinoLogger();

  const application = new Application(logger);
  await application.init();
}

bootstrap();
