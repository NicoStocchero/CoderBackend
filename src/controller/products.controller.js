import productService from "../services/product.service.js";
import { ProductDTO } from "../dto/product.dto.js";

/**
 * Obtiene todos los productos con paginación y filtros
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - Los productos
 */
export const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productService.list({ limit, page, sort, query });

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      result;

    res.json({
      status: "success",
      payload: docs.map((p) => new ProductDTO(p)),
      totalPages,
      prevPage,
      nextPage,
      page: result.page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?page=${prevPage}` : null,
      nextLink: hasNextPage ? `/api/products?page=${nextPage}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Obtiene un producto por su ID
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El producto
 */
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getById(pid);
    res.json({ status: "success", data: new ProductDTO(product) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Crea un nuevo producto
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El producto creado
 */
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, status, stock, category, thumbnails } =
      req.body;
    const newProduct = await productService.create({
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.json({ status: "success", data: new ProductDTO(newProduct) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Actualiza un producto por su ID
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El producto actualizado
 */
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, status, stock, category, thumbnails } =
      req.body;
    const updatedProduct = await productService.update(pid, {
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.json({ status: "success", data: new ProductDTO(updatedProduct) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Elimina un producto por su ID
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El producto eliminado
 */
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productService.delete(pid);

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    res.json({
      status: "success",
      message: "Producto eliminado",
      data: new ProductDTO(deleted),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
