import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { City, Component } from '../../models/index.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { plainToClass } from 'class-transformer';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { PutOfferDto } from './dto/put-offer.dto.js';
import { isValidObjectId, Types } from 'mongoose';
import { HttpError } from '../../libs/exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { createOfferDtoSchema } from './dto-schemas/create-offer-dto.schema.js';
import { putOfferDtoSchema } from './dto-schemas/put-offer-dto.schema.js';
import { AuthorizeMiddleware } from '../../libs/rest/authorize.middlewate.js';
import { ApplicationSchema } from '../../libs/config/application.schema.js';
import { Config } from '../../libs/config/config.interface.js';

@injectable()
export class OfferController extends ControllerBase {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private offerService: OfferService,
    @inject(Component.Config) private readonly config: Config<ApplicationSchema>
  ) {
    super(logger);

    this.addRoute({
      path: '/premium/:city',
      httpMethod: HttpMethod.Get,
      handleAsync: this.indexPremiumForCity.bind(this)
    });

    this.addRoute({
      path: '/favourite',
      httpMethod: HttpMethod.Get,
      handleAsync: this.indexFavouriteForUser.bind(this),
      middlewares: [
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/favourite/:id',
      httpMethod: HttpMethod.Post,
      handleAsync: this.addToFavourite.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerService, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/favourite/:id',
      httpMethod: HttpMethod.Delete,
      handleAsync: this.removeFromFavourite.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerService, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });

    this.addRoute({
      path: '/',
      httpMethod: HttpMethod.Get,
      handleAsync: this.index.bind(this)
    });
    this.addRoute({
      path: '/',
      httpMethod: HttpMethod.Post,
      handleAsync: this.create.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(createOfferDtoSchema),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/:id',
      httpMethod: HttpMethod.Get,
      handleAsync: this.showById.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerService, 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      httpMethod: HttpMethod.Put,
      handleAsync: this.updateById.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(putOfferDtoSchema),
        new ObjectIdValidatorMiddleware(this.offerService, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/:id',
      httpMethod: HttpMethod.Delete,
      handleAsync: this.deleteById.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerService, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
  }

  private async index(req: Request, res: Response): Promise<void> {
    const { limit, skip } = req.query;

    const defaultLimit = 20;
    const limitValue = limit ? parseInt(limit as string, 10) : defaultLimit;

    if (isNaN(limitValue)) {
      this.sendBadRequest('limit', limit);
    }

    const defaultSkip = 0;
    const skipValue = skip ? parseInt(skip as string, 10) : defaultSkip;

    if (isNaN(skipValue)) {
      this.sendBadRequest('skip', skip);
    }

    const offers = await this.offerService.findAll(limitValue, skipValue);
    this.ok(res, offers);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;

    const dto = plainToClass(CreateOfferDto, req.body);
    dto.authorId = userId;
    const offer = await this.offerService.create(dto);
    this.created(res, offer);
  }

  private async showById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const offer = await this.offerService.findById(new Types.ObjectId(id));
    this.ok(res, offer);
  }

  private async updateById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const { userId } = res.locals;
    const offerId = new Types.ObjectId(id);

    const offerFromDb = await this.offerService.findById(offerId);
    if (offerFromDb?.authorId != userId) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'No access to delete offer');
    }

    const dto = plainToClass(PutOfferDto, req.body);
    dto.id = new Types.ObjectId(id);
    const offer = await this.offerService.change(dto);
    this.ok(res, offer);
  }

  private async deleteById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const { userId } = res.locals;
    const offerId = new Types.ObjectId(id);

    const offer = await this.offerService.findById(offerId);
    if (offer?.authorId != userId) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'No access to delete offer');
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res);
  }

  private async indexPremiumForCity(req: Request, res: Response): Promise<void> {
    const { city } = req.params;

    const cityValue = city as City;
    if (!cityValue) {
      this.sendBadRequest('city', city);
    }

    const { limit, skip } = req.query;

    const defaultLimit = 20;
    const limitValue = limit ? parseInt(limit as string, 10) : defaultLimit;

    if (isNaN(limitValue)) {
      this.sendBadRequest('limit', limit);
    }

    const defaultSkip = 0;
    const skipValue = skip ? parseInt(skip as string, 10) : defaultSkip;

    if (isNaN(skipValue)) {
      this.sendBadRequest('skip', skip);
    }

    const offers = await this.offerService.findAllPremium(cityValue, limitValue, skipValue);
    this.ok(res, offers);
  }

  private async indexFavouriteForUser(req: Request, res: Response): Promise<void> {
    const { limit, skip } = req.query;

    const defaultLimit = 20;
    const limitValue = limit ? parseInt(limit as string, 10) : defaultLimit;

    if (isNaN(limitValue)) {
      this.sendBadRequest('limit', limit);
    }

    const defaultSkip = 0;
    const skipValue = skip ? parseInt(skip as string, 10) : defaultSkip;

    if (isNaN(skipValue)) {
      this.sendBadRequest('skip', skip);
    }

    const { userId } = res.locals;

    const offers = await this.offerService.findAllFavourite(userId, limitValue, skipValue);
    this.ok(res, offers);
  }

  private async addToFavourite(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    await this.offerService.addToFavourite(new Types.ObjectId(id), userId);
    this.ok(res, null);
  }

  private async removeFromFavourite(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    await this.offerService.removeFromFavourite(new Types.ObjectId(id), userId);
    this.ok(res, null);
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    this.logger.warn(error);
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
