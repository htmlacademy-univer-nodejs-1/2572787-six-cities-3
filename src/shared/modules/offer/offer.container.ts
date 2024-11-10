import { Container } from 'inversify';
import { Component } from '../../models/index.js';
import { types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { DefaultOfferService } from './default.offer-service.js';
import { Controller } from '../../libs/rest/controller.interface.js';
import { OfferController } from './offer-controller.js';

export function createOfferContainer(): Container {
  const container = new Container();

  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  return container;
}
