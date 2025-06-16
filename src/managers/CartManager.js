import fs from 'fs/promises';

export default class CartManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  /**
   * Lee el archivo y retorna todos los carritos
   */
  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, devuelve un array vacío
      return [];
    }
  }

  /**
   * Crea un nuevo carrito con ID autoincremental y productos vacío
   */
  async createCart() {
    const carritos = await this.getAll();

    // Generar ID autoincremental
    const nuevoId = carritos.length > 0 ? carritos[carritos.length - 1].id + 1 : 1;

    const nuevoCarrito = {
      id: nuevoId,
      products: []
    };

    carritos.push(nuevoCarrito);
    await fs.writeFile(this.path, JSON.stringify(carritos, null, 2));

    return nuevoCarrito;
  }

  /**
   * Obtiene un carrito por su ID
   */
  async getCartById(id) {
    const carritos = await this.getAll();
    const carrito = carritos.find(c => c.id == id);
    return carrito || null;
  }

  /**
   * Agrega un producto a un carrito
   * Si ya existe el producto, incrementa su cantidad
   */
  async addProductToCart(cid, pid) {
    const carritos = await this.getAll();
    const index = carritos.findIndex(c => c.id == cid);

    if (index === -1) {
      return null;
    }

    const carrito = carritos[index];
    const productoExistente = carrito.products.find(p => p.product == pid);

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
