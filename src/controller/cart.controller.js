import { cartModel } from "../models/cart.model.js";

/**
 * Crea un nuevo carrito vacío
 */
export const createCart = async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json({ status: "success", data: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Devuelve el carrito con productos populados
 */
export const getCartById = async (req, res) => {
  try {
    const cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product");
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
 * Agrega un producto o incrementa su cantidad
 */
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    const index = cart.products.findIndex((p) => p.product.toString() === pid);
    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: "success", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Elimina un producto específico del carrito
 */
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Actualiza la cantidad de un producto del carrito
 */
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    const index = cart.products.findIndex((p) => p.product.toString() === pid);
    if (index !== -1) {
      cart.products[index].quantity = quantity;
    }

    await cart.save();
    res.json({ status: "success", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Reemplaza todo el arreglo de productos
 */
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    res.json({ status: "success", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Vacía completamente el carrito
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", message: "Carrito vaciado", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
