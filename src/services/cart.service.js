import cartRepository from "../repositories/cart.repository.js";

/**
 * Servicio de Carritos
 */
class CartService {
  createEmpty() {
    return cartRepository.create({ products: [] });
  }

  getById(id) {
    return cartRepository.findById(id);
  }

  getByIdPopulated(id) {
    return cartRepository.findByIdPopulated(id);
  }

  async addProduct(cid, pid) {
    const cart = await cartRepository.findById(cid);
    if (!cart) return null;
    const index = cart.products.findIndex((p) => p.product.toString() === pid);
    if (index !== -1) cart.products[index].quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });
    await cartRepository.save(cart);
    return cart;
  }

  async removeProduct(cid, pid) {
    const cart = await cartRepository.findById(cid);
    if (!cart) return null;
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cartRepository.save(cart);
    return cart;
  }

  async updateQuantity(cid, pid, quantity) {
    const cart = await cartRepository.findById(cid);
    if (!cart) return null;
    const index = cart.products.findIndex((p) => p.product.toString() === pid);
    if (index !== -1) cart.products[index].quantity = quantity;
    await cartRepository.save(cart);
    return cart;
  }

  async replaceProducts(cid, products) {
    const cart = await cartRepository.findById(cid);
    if (!cart) return null;
    cart.products = products;
    await cartRepository.save(cart);
    return cart;
  }

  async clear(cid) {
    const cart = await cartRepository.findById(cid);
    if (!cart) return null;
    cart.products = [];
    await cartRepository.save(cart);
    return cart;
  }
}

export const cartService = new CartService();
export default cartService;
