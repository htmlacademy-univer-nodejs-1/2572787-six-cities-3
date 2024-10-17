import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Application } from './rest/index.js';
import { Config, ApplicationConfig, ApplicationSchema } from './shared/libs/config/index.js';
import { Component } from './shared/models/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';
import { createApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';

async function bootstrap() {
  const container = Container.merge(
    createApplicationContainer(),
    createUserContainer()
  );

  const application = container.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
