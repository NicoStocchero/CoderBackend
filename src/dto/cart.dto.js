export class CartDTO {
  constructor(cart) {
    const plain = cart?.toObject ? cart.toObject() : cart || {};
    this._id = plain._id;
    this.products = Array.isArray(plain.products)
      ? plain.products.map((p) => ({
          product:
            typeof p.product === "object" && p.product
              ? {
                  _id: p.product._id,
                  title: p.product.title,
                  price: p.product.price,
                  category: p.product.category,
                }
              : p.product,
          quantity: p.quantity,
        }))
      : [];
    this.createdAt = plain.createdAt || null;
    this.updatedAt = plain.updatedAt || null;
  }
}

export default CartDTO;
