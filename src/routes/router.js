import { Router } from "express";
import { customResponseMiddleware } from "../middlewares/response.js";
import { customResponseMiddleware } from "../middlewares/response.js";

/**
 * Clase para crear rutas personalizadas
 * @class
 * @param {string} path - La ruta de la API
 * @param {Function[]} middlewares - Los middlewares de la ruta
 * @returns {Router} - La ruta personalizada
 */
export class CustomRouter {
  constructor(useCustomResponses = true) {
    this.router = Router();
    if (useCustomResponses) {
      this.router.use(customResponseMiddleware);
    }
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
