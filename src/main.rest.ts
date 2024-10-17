import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from './rest/index.js';
import { Component } from './shared/models/index.js';
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
