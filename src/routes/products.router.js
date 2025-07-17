import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/products.controller.js";

const router = Router();

/**
 * GET /api/products
 * Devuelve todos los productos
 */
router.get("/", getAllProducts);

/**
 * GET /api/products/:pid
 * Devuelve un producto según su ID
 */
router.get("/:pid", getProductById);

/**
 * POST /api/products
 * Agrega un nuevo producto con campos obligatorios
 */
router.post("/", createProduct);

/**
 * PUT /api/products/:pid
 * Actualiza campos de un producto existente (excepto el ID)
 */
router.put("/:pid", updateProduct);

/**
 * DELETE /api/products/:pid
 * Elimina un producto por ID
 */
router.delete("/:pid", deleteProduct);

export default router;
