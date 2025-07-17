import { productModel } from "../models/products.model.js";

/**
 * GET /api/products
 * Obtiene todos los productos con paginación y filtros
 */
export const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === "disponibles") {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }

    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    };

    const result = await productModel.paginate(filter, options);

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      result;

    res.json({
      status: "success",
      payload: docs,
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
 * GET /api/products/:pid
 * Obtiene un producto por su ID
 */
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid);
    res.json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * POST /api/products
 * Crea un nuevo producto
 */
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, status, stock, category, thumbnails } =
      req.body;
    const newProduct = await productModel.create({
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * PUT /api/products/:pid
 * Actualiza un producto por su ID
 */
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, status, stock, category, thumbnails } =
      req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      pid,
      { title, description, price, status, stock, category, thumbnails },
      { new: true }
    );
    res.json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * DELETE /api/products/:pid
 * Elimina un producto por su ID
 */
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productModel.findByIdAndDelete(pid);

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    res.json({
      status: "success",
      message: "Producto eliminado",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
