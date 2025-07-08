import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const productManager = new ProductManager("./src/data/products.json");

// Ruta para la vista de productos estáticos
router.get("/home", async (req, res) => {
  const products = await productManager.getAll();
  res.render("home", { products });
});

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAll();
  res.render("realTimeProducts", { products });
});

export default router;
