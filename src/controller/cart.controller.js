import cartService from "../services/cart.service.js";
import purchaseService from "../services/purchase.service.js";
import { CartDTO } from "../dto/cart.dto.js";

/**
 * Crea un nuevo carrito vacío
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El carrito creado
 */
export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createEmpty();
    res.status(201).json({ status: "success", data: new CartDTO(newCart) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Devuelve el carrito con productos populados
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El carrito con productos populados
 */
export const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getByIdPopulated(req.params.cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", data: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Agrega un producto o incrementa su cantidad
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El carrito con el producto agregado o incrementado
 */
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProduct(cid, pid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", data: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Elimina un producto específico del carrito
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El carrito con el producto eliminado
 */
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.removeProduct(cid, pid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", data: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Actualiza la cantidad de un producto del carrito
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El carrito con la cantidad actualizada
 */
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateQuantity(cid, pid, quantity);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", data: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Reemplaza todo el arreglo de productos
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - El carrito con los productos reemplazados
 */
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartService.replaceProducts(cid, products);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Vacía completamente el carrito
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El carrito vaciado
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clear(req.params.cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", message: "Carrito vaciado", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Procesa la compra del carrito, genera ticket y devuelve pendientes
 * @param {Request} req
 * @param {Response} res
 */
export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user?.email || "unknown@local";
    const result = await purchaseService.purchaseCart(cid, purchaserEmail);
    if (result.error) {
      return res.status(404).json({ status: "error", message: result.error });
    }
    return res.json({ status: "success", data: result });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
