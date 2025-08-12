import fs from "fs/promises";

/**
 * @typedef {Object} Carrito
 * @property {string} id - El ID del carrito
 * @property {Object[]} products - Los productos del carrito
 */

/**
 * Archivo obsoleto, no se usa
 * Se usa el modelo de carrito de mongoose
 * @param {string} rutaArchivo - La ruta del archivo
 */

export default class CartManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  /**
   * Lee el archivo y retorna todos los carritos
   * @returns {Carrito[]} - Los carritos
   */
  async getAll() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, devuelve un array vacío
      return [];
    }
  }

  /**
   * Crea un nuevo carrito con ID autoincremental y productos vacío
   * @returns {Carrito} - El carrito creado
   */
  async createCart() {
    const carritos = await this.getAll();

    // Generar ID autoincremental
    const nuevoId =
      carritos.length > 0 ? carritos[carritos.length - 1].id + 1 : 1;

    const nuevoCarrito = {
      id: nuevoId,
      products: [],
    };

    carritos.push(nuevoCarrito);
    await fs.writeFile(this.path, JSON.stringify(carritos, null, 2));

    return nuevoCarrito;
  }

  /**
   * Obtiene un carrito por su ID
   * @param {string} id - El ID del carrito
   * @returns {Carrito} - El carrito
   */
  async getCartById(id) {
    const carritos = await this.getAll();
    const carrito = carritos.find((c) => c.id == id);
    return carrito || null;
  }

  /**
   * Agrega un producto a un carrito
   * Si ya existe el producto, incrementa su cantidad
   * @param {string} cid - El ID del carrito
   * @param {string} pid - El ID del producto
   * @returns {Carrito} - El carrito
   */
  async addProductToCart(cid, pid) {
    const carritos = await this.getAll();
    const index = carritos.findIndex((c) => c.id == cid);

    if (index === -1) {
      return null;
    }

    const carrito = carritos[index];
    const productoExistente = carrito.products.find((p) => p.product == pid);

    if (productoExistente) {
      // Si ya está en el carrito, aumentar la cantidad
      productoExistente.quantity += 1;
    } else {
      // Si no está, agregar con cantidad 1
      carrito.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carritos, null, 2));

    return carrito;
  }
}
