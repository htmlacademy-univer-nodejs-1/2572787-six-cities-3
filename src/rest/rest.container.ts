import { Container } from 'inversify';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Application } from './index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { ApplicationConfig, ApplicationSchema, Config } from '../shared/libs/config/index.js';
import { Component } from '../shared/models/index.js';
import { ExceptionFilter } from '../shared/libs/exception-filter/exception-filter.interface.js';
import { LoggingExceptionFilter } from '../shared/libs/exception-filter/logging-exception-filter.js';

export function createApplicationContainer(): Container {
  const container = new Container();

  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<ApplicationSchema>>(Component.Config).to(ApplicationConfig).inSingletonScope();
  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<ExceptionFilter>(Component.ExceptionFilter).to(LoggingExceptionFilter).inSingletonScope();

  return container;
}
