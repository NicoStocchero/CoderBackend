import mongoose from "mongoose";

/**
 * Esquema de usuario
 * @param {string} first_name - El nombre del usuario
 * @param {string} last_name - El apellido del usuario
 * @param {string} email - El correo electrónico del usuario
 * @param {number} age - La edad del usuario
 * @param {string} password - La contraseña del usuario
 * @param {mongoose.Schema.Types.ObjectId} cart - El carrito del usuario
 * @param {string} role - El rol del usuario
 * @returns {mongoose.Schema} - El usuario
 */
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export const mongooseSchema = mongoose.model("User", userSchema);

export default mongooseSchema;
