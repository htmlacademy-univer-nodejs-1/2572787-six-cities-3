import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Application } from './rest/index.js';
import { Config, ApplicationConfig, ApplicationSchema } from './shared/libs/config/index.js';
import { Component } from './shared/models/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Logger>(Component.Looger).to(PinoLogger).inSingletonScope();
  container.bind<Config<ApplicationSchema>>(Component.Config).to(ApplicationConfig).inSingletonScope();
  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  const application = container.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
