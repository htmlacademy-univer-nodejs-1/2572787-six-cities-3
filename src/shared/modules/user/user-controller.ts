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
import { UploadFileMiddleware } from '../../libs/rest/upload-file.middleware.js';
import { AuthorizeMiddleware } from '../../libs/rest/authorize.middlewate.js';
import { HttpError } from '../../libs/exception-filter/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from './dto/login.dto.js';
import { getToken } from '../../helpers/jwt-tokens.js';
import { loginDtoSchema } from './schemas/login-dto.schema.js';
import { toFullModel } from './conventers.js';

@injectable()
export class UserController extends ControllerBase {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.Config) private config: Config<ApplicationSchema>,
    @inject(Component.UserService) private userService: UserService
  ) {
    super(logger);

    this.addRoute({
      path: '/register',
      httpMethod: HttpMethod.Post,
      handleAsync: this.register.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(createUserDtoSchema)
      ]
    });
    this.addRoute({
      path: '/login',
      httpMethod: HttpMethod.Post,
      handleAsync: this.login.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(loginDtoSchema)
      ]
    });
    this.addRoute({
      path: '/me',
      httpMethod: HttpMethod.Get,
      handleAsync: this.me.bind(this),
      middlewares: [
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/me/avatar',
      httpMethod: HttpMethod.Post,
      handleAsync: this.loadAvatar.bind(this),
      middlewares: [
        new AuthorizeMiddleware(this.config.get('JWT_SECRET')),
        new UploadFileMiddleware(this.config.get('STATIC_ROOT'), 'avatar')
      ]
    });
  }

  private async loadAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;

    const filepath = req.file?.path;
    if (!filepath) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Avatar not loaded');
    }

    await this.userService.updateAvatar(userId, filepath);
    this.created(res, { filepath });
  }

  private async register(req: Request, res: Response): Promise<void> {
    const dto = plainToClass(CreateUserDto, req.body);

    const avatarPath = req.file?.path;
    if (avatarPath) {
      dto.avatar = avatarPath;
    }

    const user = await this.userService.create(dto, this.config.get('SALT'));
    this.created(res, toFullModel(user));
  }

  private async login(req: Request, res: Response): Promise<void> {
    const dto = plainToClass(LoginDto, req.body);

    const user = await this.userService.checkPassword(dto.email, dto.password, this.config.get('SALT'));
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong credentials');
    }

    const accessToken = await getToken({ userId: user.id }, this.config.get('JWT_SECRET'));
    this.ok(res, { accessToken });
  }

  private async me(_req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;

    const user = await this.userService.findById(userId);

    if (user == null) {
      this.send(res, StatusCodes.UNAUTHORIZED, null);
      return;
    }

    this.ok(res, toFullModel(user));
  }
}
