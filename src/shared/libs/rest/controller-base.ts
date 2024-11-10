import { Router, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Controller } from "./controller.interface.js";
import { Route } from "./route.interface.js";
import { HttpMethod } from "./http-method.enum.js";

export abstract class ControllerBase implements Controller {
  public readonly router: Router;

  public addRoute(route: Route): void {
    switch (route.httpMethod) {
      case HttpMethod.Get:
        this.router.get(route.path, async (res, req) => await route.handle(res, req));
        return;
      case HttpMethod.Post:
        this.router.post(route.path, async (res, req) => await route.handle(res, req));
        return;
      case HttpMethod.Delete:
        this.router.delete(route.path, async (res, req) => await route.handle(res, req));
        return;
      case HttpMethod.Put:
        this.router.put(route.path, async (res, req) => await route.handle(res, req));
        return;
      case HttpMethod.Patch:
        this.router.patch(route.path, async (res, req) => await route.handle(res, req));
        return;
    }
  }

  public send<T>(res: Response, statusCode: StatusCodes, data: T): void {
    res.statusCode = statusCode;
    res.write(JSON.stringify(data));
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }
}
