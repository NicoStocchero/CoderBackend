import { cartModel } from "../models/cart.model.js";

/**
 * Middleware para asegurar que el carrito exista
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @param {Function} next - La función para continuar
 */
export const ensureCart = async (req, res, next) => {
  if (!req.session.cartId) {
    const newCart = await cartModel.create({ products: [] });
    req.session.cartId = newCart._id.toString();
  }
  next();
};
