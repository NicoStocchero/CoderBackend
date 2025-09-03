import productRepository from "../repositories/product.repository.js";

/**
 * Servicio de Productos
 * Contiene la lógica de negocio relacionada a productos
 */
class ProductService {
  async list({ limit = 10, page = 1, sort, query }) {
    const filter = {};
    if (query) {
      if (query === "disponibles") filter.stock = { $gt: 0 };
      else filter.category = query;
    }

    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    };

    return productRepository.paginate(filter, options);
  }

  getById(id) {
    return productRepository.findById(id);
  }

  create(data) {
    return productRepository.create(data);
  }

  update(id, data) {
    return productRepository.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return productRepository.findByIdAndDelete(id);
  }
}

export const productService = new ProductService();
export default productService;
