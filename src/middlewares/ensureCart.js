import { cartModel } from "../models/cart.model.js";

/**
 * Middleware para asegurar que el carrito exista
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @param {Function} next - La función para continuar
 * @returns {void} - El carrito creado
 */
export const ensureCart = async (req, res, next) => {
  try {
    if (!req.cookies?.cartId) {
      const newCart = await cartModel.create({ products: [] });
      const cartId = newCart._id.toString();
      res.cookie("cartId", cartId, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
      req.cookies.cartId = cartId;
    }
    next();
  } catch (err) {
    next(err);
  }
};
