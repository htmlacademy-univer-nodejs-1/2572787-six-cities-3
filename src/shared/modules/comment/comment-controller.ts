import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { Component } from '../../models/index.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { HttpError } from '../../libs/exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './index.js';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { createCommentDtoSchema } from './dto-schemas/create-comment-dto.schema.js';
import { AuthorizeMiddleware } from '../../libs/rest/authorize.middlewate.js';
import { Config } from '../../libs/config/config.interface.js';
import { ApplicationSchema } from '../../libs/config/application.schema.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { toFullModel } from './conveters.js';
import { UserService } from '../user/user-service.interface.js';
import { Types } from 'mongoose';

@injectable()
export class CommentController extends ControllerBase {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentService) private commentService: CommentService,
    @inject(Component.OfferService) private offerService: OfferService,
    @inject(Component.UserService) private userService: UserService,
    @inject(Component.Config) private readonly config: Config<ApplicationSchema>
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId/comments',
      httpMethod: HttpMethod.Get,
      handleAsync: this.index.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerService, 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      httpMethod: HttpMethod.Post,
      handleAsync: this.create.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(createCommentDtoSchema),
        new ObjectIdValidatorMiddleware(this.offerService, 'offerId'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'), false)
      ]
    });
  }

  private async create(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { offerId } = req.params;

    const dto = plainToClass(CreateCommentDto, req.body);
    dto.authorId = userId;
    dto.offerId = offerId;
    const comment = await this.commentService.create(dto);
    const user = await this.userService.findById(new Types.ObjectId(String(userId)));

    this.created(res, toFullModel(comment, user!, this.config.get('HOST')));
  }

  private async index(req: Request, res: Response): Promise<void> {
    const { limit, skip } = req.query;

    const defaultLimit = 60;
    const limitValue = limit ? parseInt(limit as string, 10) : defaultLimit;

    if (isNaN(limitValue)) {
      this.sendBadRequest('limit', limit);
    }

    const defaultSkip = 0;
    const skipValue = skip ? parseInt(skip as string, 10) : defaultSkip;

    if (isNaN(skipValue)) {
      this.sendBadRequest('skip', skip);
    }

    const { offerId } = req.params;
    const result = await this.commentService.findAllForOffer(offerId, limitValue, skipValue);
    const mappedResult = [];

    for (const comment of result) {
      const user = await this.userService.findById(new Types.ObjectId(comment.authorId.toString()));
      mappedResult.push(toFullModel(comment, user!, this.config.get('HOST')));
    }

    this.ok(res, mappedResult);
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    this.logger.warn(error);
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
