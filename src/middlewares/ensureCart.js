import { cartModel } from "../models/cart.model.js";

export const ensureCart = async (req, res, next) => {
  if (!req.session.cartId) {
    const newCart = await cartModel.create({ products: [] });
    req.session.cartId = newCart._id.toString();
  }
  next();
};
