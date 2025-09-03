import { productModel } from "../models/products.model.js";

/**
 * Repository de Productos
 * Encapsula el acceso a datos (Mongoose) y expone una API clara
 */
class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Listado paginado con filtros y orden
   * @param {Object} filter - Filtro de consulta
   * @param {Object} options - Opciones de paginación
   */
  paginate(filter, options) {
    return this.model.paginate(filter, options);
  }

  /** @param {Object} filter */
  find(filter = {}) {
    return this.model.find(filter);
  }

  /** @param {string} id */
  findById(id) {
    return this.model.findById(id);
  }

  /** @param {Object} data */
  create(data) {
    return this.model.create(data);
  }

  /** @param {string} id @param {Object} data @param {Object} options */
  findByIdAndUpdate(id, data, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  /** @param {string} id */
  findByIdAndDelete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

export const productRepository = new ProductRepository(productModel);
export default productRepository;
