import fs from 'fs/promises';

export default class ProductManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  /**
   * Lee el archivo y retorna el array de productos
   */
  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, se devuelve un array vacío
      return [];
    }
  }

  /**
   * Busca un producto por su ID
   */
  async getById(id) {
    const productos = await this.getAll();
    const encontrado = productos.find(p => p.id == id);
    return encontrado || null;
  }

  /**
   * Agrega un nuevo producto con ID autoincremental
   */
  async addProduct(producto) {
    const productos = await this.getAll();

    // Generar ID autoincremental
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

    const nuevoProducto = {
      id: nuevoId,
      title: producto.title || '',
      description: producto.description || '',
      code: producto.code || '',
      price: producto.price || 0,
      status: producto.status ?? true,
      stock: producto.stock || 0,
      category: producto.category || '',
      thumbnails: Array.isArray(producto.thumbnails) ? producto.thumbnails : []
    };

    productos.push(nuevoProducto);
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));

    return nuevoProducto;
  }

  /**
   * Actualiza un producto existente (sin tocar el ID)
   */
  async updateProduct(id, campos) {
    const productos = await this.getAll();
    const index = productos.findIndex(p => p.id == id);

    if (index === -1) {
      return null;
    }

    // No se permite modificar el ID
    const actualizado = { ...productos[index], ...campos, id: productos[index].id };

    productos[index] = actualizado;
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));

    return actualizado;
  }

  /**
   * Elimina un producto por su ID
   */
  async deleteProduct(id) {
    const productos = await this.getAll();
    const filtrados = productos.filter(p => p.id != id);

    if (filtrados.length === productos.length) {
      return null;
    }

    await fs.writeFile(this.path, JSON.stringify(filtrados, null, 2));
    return { eliminado: id };
  }
}
