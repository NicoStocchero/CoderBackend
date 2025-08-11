import mongoose from "mongoose";

/**
 * Esquema de usuario
 * @param {Object} first_name - El nombre del usuario
 * @param {Object} last_name - El apellido del usuario
 * @param {Object} email - El correo electrónico del usuario
 * @param {Object} age - La edad del usuario
 * @param {Object} password - La contraseña del usuario
 * @param {Object} cart - El carrito del usuario
 * @param {Object} role - El rol del usuario
 * @returns {Object} - El usuario
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
