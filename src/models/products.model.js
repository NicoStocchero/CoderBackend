import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Esquema de producto
 * @param {string} title - El título del producto
 * @param {string} description - La descripción del producto
 * @param {number} price - El precio del producto
 * @param {boolean} status - El estado del producto
 * @param {number} stock - El stock del producto
 * @param {string} category - La categoría del producto
 * @param {string[]} thumbnails - Las miniaturas del producto
 * @returns {mongoose.Schema} - El producto
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
