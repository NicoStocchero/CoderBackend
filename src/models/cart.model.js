import { Schema, model } from "mongoose";

/**
 * Esquema de carrito
 * @param {Object} products - Los productos del carrito
 * @returns {Object} - El carrito
 */
const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export const cartModel = model("Cart", cartSchema);
