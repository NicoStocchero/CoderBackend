import { Router } from "express";
import {
  renderHome,
  renderRealTimeProducts,
  renderProductsList,
  renderProductDetail,
  renderCartDetail,
} from "../controller/views.controller.js";

const router = Router();

// Ruta para la vista de productos estáticos
router.get("/home", renderHome);

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", renderRealTimeProducts);

// Ruta para la vista de productos con paginación y filtros
router.get("/products", renderProductsList);

// Ruta para la vista de detalle de producto
router.get("/products/:pid", renderProductDetail);

// Ruta para la vista de detalle de carrito
router.get("/carts/:cid", renderCartDetail);

export default router;
