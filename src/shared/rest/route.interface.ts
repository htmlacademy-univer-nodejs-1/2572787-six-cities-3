import { HttpMethod } from './http-method.enum.js';
import { Request, Response } from 'express';

export interface Route {
  path: string;
  httpMethod: HttpMethod;
  handle(req: Request, res: Response): Promise<void>;
}
