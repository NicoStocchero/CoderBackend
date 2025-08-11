import { productModel } from "../models/products.model.js";
import { cartModel } from "../models/cart.model.js";

/**
 * Vista de productos estáticos
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - La vista de productos estáticos
 */
export const renderHome = async (req, res) => {
  const products = await productModel.find().lean();
  res.render("home", { products });
};

/**
 * Vista de productos en tiempo real
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - La vista de productos en tiempo real
 */
export const renderRealTimeProducts = async (req, res) => {
  const products = await productModel.find().lean();
  res.render("realTimeProducts", { products });
};

/**
 * Vista de productos con paginación y filtros
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - La vista de productos con paginación y filtros
 */
export const renderProductsList = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = {};
  if (query) {
    filter[query === "disponibles" ? "stock" : "category"] =
      query === "disponibles" ? { $gt: 0 } : query;
  }

  const sortOption =
    sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

  const result = await productModel.paginate(filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOption,
    lean: true,
  });

  res.render("products", {
    products: result.docs,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    query,
    sort,
    cartId: req.session.cartId,
  });
};

/**
 * Vista de detalle de producto
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - La vista de detalle de producto
 */
export const renderProductDetail = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).lean();
    if (!product) {
      return res
        .status(404)
        .render("error", { message: "Producto no encontrado" });
    }
    res.render("productDetail", { product, cartId: req.session.cartId });
  } catch {
    res.status(500).render("error", { message: "Error al cargar el producto" });
  }
};

/**
 * Vista de detalle de carrito
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - La vista de detalle de carrito
 */
export const renderCartDetail = async (req, res) => {
  try {
    const cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res
        .status(404)
        .render("error", { message: "Carrito no encontrado" });
    }

    const total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );

    res.render("cartDetail", { cart, total, cartId: req.session.cartId });
  } catch {
    res.status(500).render("error", { message: "Error al cargar el carrito" });
  }
};
