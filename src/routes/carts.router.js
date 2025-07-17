import { Router } from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  clearCart,
  updateCartProducts,
} from "../controller/cart.controller.js";

const router = Router();

/**
 * POST /api/carts
 * Crea un nuevo carrito (con ID autogenerado y sin productos)
 */
router.post("/", createCart);
/**
 * GET /api/carts/:cid
 * Devuelve todos los productos de un carrito específico
 */
router.get("/:cid", getCartById);

/**
 * POST /api/carts/:cid/product/:pid
 * Agrega un producto al carrito (si ya existe, incrementa cantidad)
 */
router.post("/:cid/products/:pid", addProductToCart);

/**
 * DELETE /api/carts/:cid/products/:pid
 * Elimina un producto específico del carrito
 */
router.delete("/:cid/products/:pid", removeProductFromCart);

/**
 * PUT /api/carts/:cid/products/:pid
 * Actualiza la cantidad de un producto en el carrito
 * Body: { quantity: number }
 */
router.put("/:cid/products/:pid", updateProductQuantity);

/**
 * DELETE /api/carts/:cid
 * Vacía completamente el carrito
 */
router.delete("/:cid", clearCart);

/**
 * PUT /api/carts/:cid
 * Reemplaza el array completo de productos del carrito
 * Body: { products: [ { product, quantity } ] }
 */
router.put("/:cid", updateCartProducts);

export default router;
