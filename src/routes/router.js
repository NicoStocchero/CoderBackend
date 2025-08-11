import { Router } from "express";
import { customResponseMiddleware } from "../middlewares/response.js";

export class CustomRouter {
  constructor() {
    this.router = Router();
    this.router.use(customResponseMiddleware);
  }

  get(path, ...middlewares) {
    return this.router.get(path, ...middlewares);
  }

  post(path, ...middlewares) {
    return this.router.post(path, ...middlewares);
  }

  put(path, ...middlewares) {
    return this.router.put(path, ...middlewares);
  }

  delete(path, ...middlewares) {
    return this.router.delete(path, ...middlewares);
  }

  asyncHandler(functions = []) {
    return functions.map((func) => {
      return async (req, res, next) => {
        try {
          await func(req, res, next);
        } catch (error) {
          next(error);
        }
      };
    });
  }

  getRouter() {
    return this.router;
  }
}
