// src/scripts/importProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { productModel } from "../models/products.model.js";
import { readFile } from "fs/promises";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  try {
    const fileContent = await readFile("./src/data/products.json", "utf-8");
    const products = JSON.parse(fileContent);

    await mongoose.connect(MONGO_URI);
    await productModel.deleteMany();
    await productModel.insertMany(products);

    console.log("✅ Productos cargados a Mongo correctamente");
    process.exit();
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    process.exit(1);
  }
};

run();
