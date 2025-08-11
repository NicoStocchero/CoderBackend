import bcrypt from "bcrypt";
import { mongooseSchema as User } from "../models/user.model.js";
import { cartModel } from "../models/cart.model.js";

const sanitize = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : doc;
  delete plain.password;
  delete plain.__v;
  return plain;
};

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
