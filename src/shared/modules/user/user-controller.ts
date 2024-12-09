import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { Component } from '../../models/index.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { UserService } from './user-service.interface.js';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ApplicationSchema, Config } from '../../libs/config/index.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { createUserDtoSchema } from './schemas/create-user-dto.schema.js';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/upload-file.middleware.js';

@injectable()
export class UserController extends ControllerBase {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.Config) private config: Config<ApplicationSchema>,
    @inject(Component.UserService) private userService: UserService
  ) {
    super(logger);

    this.addRoute({path: '/', httpMethod: HttpMethod.Post, handleAsync: this.create.bind(this), middlewares: [new SchemaValidatorMiddleware(createUserDtoSchema)]});
    this.addRoute({path: '/:id/avatar', httpMethod: HttpMethod.Post, handleAsync: this.loadAvatar.bind(this), middlewares: [new ObjectIdValidatorMiddleware(this.userService, 'id'), new UploadFileMiddleware(this.config.get('STATIC_ROOT'), 'avatar')]})
  }

  private async create(req: Request, res: Response): Promise<void> {
    const dto = plainToClass(CreateUserDto, req.body);
    const user = await this.userService.create(dto, this.config.get('SALT'));
    this.created(res, user);
  }

  private async loadAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, { filepath: req.file?.path });
  }
}
