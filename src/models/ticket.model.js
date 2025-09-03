import { Schema, model } from "mongoose";

/**
 * Esquema de Ticket de compra
 * @param {string} code - Código único del ticket
 * @param {Date} purchase_datetime - Fecha/hora de compra
 * @param {number} amount - Monto total
 * @param {string} purchaser - Email del comprador
 */
const ticketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
  },
  { timestamps: true }
);

export const ticketModel = model("Ticket", ticketSchema);
export default ticketModel;
