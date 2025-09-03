import { cartModel } from "../models/cart.model.js";

/**
 * Repository de Carritos
 */
class CartRepository {
  constructor(model) {
    this.model = model;
  }

  /** @param {Object} data */
  create(data) {
    return this.model.create(data);
  }

  /** @param {string} id */
  findById(id) {
    return this.model.findById(id);
  }

  /** @param {string} id */
  findByIdPopulated(id) {
    return this.model.findById(id).populate("products.product");
  }

  /** @param {string} id */
  save(doc) {
    return doc.save();
  }
}

export const cartRepository = new CartRepository(cartModel);
export default cartRepository;
