import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Esquema de producto
 * @param {Object} title - El título del producto
 * @param {Object} description - La descripción del producto
 * @param {Object} price - El precio del producto
 * @param {Object} status - El estado del producto
 * @param {Object} stock - El stock del producto
 * @param {Object} category - La categoría del producto
 * @param {Object} thumbnails - Las miniaturas del producto
 * @returns {Object} - El producto
 */
const productSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true, index: true },
  category: { type: String, required: true, index: true },
  thumbnails: { type: [String], required: true },
});

productSchema.plugin(mongoosePaginate);

export const productModel = model("Product", productSchema);
