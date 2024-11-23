
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../exception-filter/http-error.js';

export class ObjectIdValidatorMiddleware implements Middleware {
  constructor(private param: string) {}

  public handleAsync(req: Request, _res: Response, next: NextFunction): void {
    const value = req.params[this.param];

    if (Types.ObjectId.isValid(value)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${this.param} is invalid ObjectID`
    );
  }
}
