import bcrypt from "bcrypt";
import { mongooseSchema as User } from "../models/user.model.js";
import { cartModel } from "../models/cart.model.js";

/**
 * Sanitiza el usuario para evitar exponer datos sensibles
 * @param {Object} doc - El documento a sanitizar
 * @returns {Object} - El documento sanitizado
 */
const sanitize = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : doc;
  delete plain.password;
  delete plain.__v;
  return plain;
};

/**
 * Obtiene todos los usuarios
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - Los usuarios
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    const sanitized = users.map((u) => {
      const { password, __v, ...rest } = u;
      return rest;
    });
    return res.json({ status: "success", data: sanitized });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Obtiene un usuario por su ID
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - El usuario
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    return res.json({ status: "success", data: sanitize(user) });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Crea un nuevo usuario
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - El usuario creado
 */
export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: "bad request",
        message: "Campos requeridos faltantes",
      });
    }
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(409)
        .json({ status: "conflict", message: "El email ya existe" });

    const hashed = bcrypt.hashSync(password, 10);
    const newCart = await cartModel.create({ products: [] });
    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashed,
      role: role || "user",
      cart: newCart._id,
    });
    return res.status(201).json({ status: "success", data: sanitize(user) });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Actualiza un usuario
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - El usuario actualizado
 */
export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.uid, updates, {
      new: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    return res.json({ status: "success", data: sanitize(user) });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Elimina un usuario
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 * @returns {Object} - El usuario eliminado
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.uid);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    return res.json({
      status: "success",
      message: "Usuario eliminado",
      data: sanitize(user),
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
