import fs from "fs/promises";

/**
 * @typedef {Object} Producto
 * @property {string} id - El ID del producto
 * @property {string} title - El título del producto
 * @property {string} description - La descripción del producto
 * @property {number} price - El precio del producto
 * @property {boolean} status - El estado del producto
 * @property {number} stock - El stock del producto
 * @property {string} category - La categoría del producto
 * @property {string[]} thumbnails - Las miniaturas del producto
 */

/**
 * Archivo obsoleto, no se usa
 * Se usa el modelo de producto de mongoose
 * @param {string} rutaArchivo - La ruta del archivo
 */

export default class ProductManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  /**
   * Lee el archivo y retorna el array de productos
   * @returns {Object[]} - Los productos
   */
  async getAll() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, se devuelve un array vacío
      return [];
    }
  }

  /**
   * Busca un producto por su ID
   * @param {string} id - El ID del producto
   * @returns {Object} - El producto encontrado
   */
  async getById(id) {
    const productos = await this.getAll();
    const encontrado = productos.find((p) => p.id == id);
    return encontrado || null;
  }

  /**
   * Agrega un nuevo producto con ID autoincremental
   * @param {Producto} producto - El producto a agregar
   * @returns {Producto} - El producto agregado
   */
  async addProduct(producto) {
    const productos = await this.getAll();

    // Generar ID autoincremental
    const nuevoId =
      productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

    const nuevoProducto = {
      id: nuevoId,
      title: producto.title || "",
      description: producto.description || "",
      code: producto.code || "",
      price: producto.price || 0,
      status: producto.status ?? true,
      stock: producto.stock || 0,
      category: producto.category || "",
      thumbnails: Array.isArray(producto.thumbnails) ? producto.thumbnails : [],
    };

    productos.push(nuevoProducto);
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));

    return nuevoProducto;
  }

  /**
   * Actualiza un producto existente (sin tocar el ID)
   * @param {string} id - El ID del producto
   * @param {Partial<Producto>} campos - Los campos a actualizar
   * @returns {Producto} - El producto actualizado
   */
  async updateProduct(id, campos) {
    const productos = await this.getAll();
    const index = productos.findIndex((p) => p.id == id);

    if (index === -1) {
      return null;
    }

    // No se permite modificar el ID
    const actualizado = {
      ...productos[index],
      ...campos,
      id: productos[index].id,
    };

    productos[index] = actualizado;
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));

    return actualizado;
  }

  /**
   * Elimina un producto por su ID
   * @param {string} id - El ID del producto
   * @returns {Producto} - El producto eliminado
   */
  async deleteProduct(id) {
    const productos = await this.getAll();
    const filtrados = productos.filter((p) => p.id != id);

    if (filtrados.length === productos.length) {
      return null;
    }

    await fs.writeFile(this.path, JSON.stringify(filtrados, null, 2));
    return { eliminado: id };
  }
}
