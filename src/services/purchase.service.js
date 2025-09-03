import { productRepository } from "../repositories/product.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import { ticketModel } from "../models/ticket.model.js";
import crypto from "crypto";

/**
 * Servicio de Compra
 * Verifica stock, descuenta, genera ticket y devuelve pendientes
 */
class PurchaseService {
  async purchaseCart(cartId, purchaserEmail) {
    const cart = await cartRepository.findByIdPopulated(cartId);
    if (!cart) {
      return { error: "Carrito no encontrado" };
    }

    let total = 0;
    const notProcessed = [];

    // Intentar procesar cada línea del carrito
    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;
      if (!product) {
        notProcessed.push({ product: null, requested: quantity, stock: 0 });
        continue;
      }

      // Decremento atómico: solo descuenta si hay stock suficiente en ese momento
      const updated = await productRepository.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -quantity } },
        { new: true }
      );

      // Si la operación dejó stock negativo, revertir y marcar como no procesado
      if (!updated || updated.stock < 0) {
        // Revertir intento si fue aplicado
        if (updated) {
          await productRepository.findByIdAndUpdate(product._id, {
            $inc: { stock: quantity },
          });
        }
        notProcessed.push({
          product: product._id,
          requested: quantity,
          stock: product.stock ?? 0,
        });
        continue;
      }

      total += product.price * quantity;
    }

    // Dejar en el carrito solo los no procesados
    cart.products = cart.products.filter((p) =>
      notProcessed.find((np) => String(np.product) === String(p.product._id))
    );
    await cartRepository.save(cart);

    // Generar ticket si hubo compra parcial o total
    let ticket = null;
    if (total > 0) {
      const code = crypto.randomBytes(8).toString("hex");
      ticket = await ticketModel.create({
        code,
        amount: total,
        purchaser: purchaserEmail,
      });
    }

    return { ticket, notProcessed };
  }
}

export const purchaseService = new PurchaseService();
export default purchaseService;
