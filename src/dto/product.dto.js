export class ProductDTO {
  constructor(product) {
    const plain = product?.toObject ? product.toObject() : product || {};
    this._id = plain._id;
    this.title = plain.title;
    this.description = plain.description;
    this.price = plain.price;
    this.status = plain.status;
    this.stock = plain.stock;
    this.category = plain.category;
    this.thumbnails = Array.isArray(plain.thumbnails) ? plain.thumbnails : [];
  }
}

export default ProductDTO;
