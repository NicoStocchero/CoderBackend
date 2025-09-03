import bcrypt from "bcrypt";
import { userService } from "../services/user.service.js";
import cartService from "../services/cart.service.js";

/**
 * Sanitiza el usuario para evitar exponer datos sensibles
 * @param {mongoose.Schema} doc - El documento a sanitizar
 * @returns {mongoose.Schema} - El documento sanitizado
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
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - Los usuarios
 */
export const getUsers = async (req, res) => {
  try {
    const users = await userService.findAll();
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
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario
 */
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.uid);
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
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario creado
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
    const exists = await userService.getByEmail(email);
    if (exists)
      return res
        .status(409)
        .json({ status: "conflict", message: "El email ya existe" });

    const hashed = bcrypt.hashSync(password, 10);
    const newCart = await cartService.createEmpty();
    const user = await userService.create({
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
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario actualizado
 */
export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }
    const user = await userService.update(req.params.uid, updates);
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
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario eliminado
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await userService.delete(req.params.uid);
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
