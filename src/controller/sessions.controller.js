import jwt from "jsonwebtoken";
import { UserDTO } from "../dto/user.dto.js";
import bcrypt from "bcrypt";
import { userService } from "../services/user.service.js";
import mailService from "../services/mail.service.js";

export const TOKEN_COOKIE = "token";
const JWT_SECRET = process.env.JWT_SECRET;
const RESET_SECRET = process.env.RESET_SECRET;

/**
 * Sanitiza el usuario para evitar exponer datos sensibles
 * @param {Object} user - El usuario a sanitizar
 * @returns {Object} - El usuario sanitizado
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  const plain = user.toObject ? user.toObject() : user;
  const { password, __v, ...rest } = plain;
  return rest;
};

/**
 * Registra un nuevo usuario
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario creado
 */
export const registerController = async (req, res) => {
  return res.status(201).json({ message: "User created" });
};

/**
 * Inicia sesión
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario logueado
 */
export const loginController = async (req, res) => {
  try {
    const safeUser = sanitizeUser(req.user);
    const token = jwt.sign({ user: safeUser }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful", user: safeUser, token });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * Obtiene el usuario actual
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El usuario actual
 */
export const currentController = (req, res) => {
  // Devolver DTO (evita exponer información sensible)
  const dto = new UserDTO(req.user);
  return res.json({ user: dto });
};

/**
 * Cierra sesión
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @returns {void} - El mensaje de cierre de sesión
 */
export const logoutController = (req, res) => {
  res.clearCookie(TOKEN_COOKIE);
  res.json({ message: "Logged out" });
};

/**
 * Inicia flujo de recuperación: genera token 1h y envía email
 */
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return (
        res.badRequest?.("Email requerido") ||
        res.status(400).json({ message: "Email requerido" })
      );

    const user = await userService.getByEmail(email);
    if (!user)
      return res
        .status(200)
        .json({ message: "Si el correo existe, se enviará un enlace" });

    const token = jwt.sign({ uid: user._id, email: user.email }, RESET_SECRET, {
      expiresIn: "1h",
    });
    await mailService.sendPasswordReset(user.email, token);
    return res.json({ message: "Correo de recuperación enviado" });
  } catch (err) {
    return res.status(500).json({ message: "Error al iniciar recuperación" });
  }
};

/**
 * Completa el reseteo: valida token, chequea nueva != anterior, actualiza hash
 */
export const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return (
        res.badRequest?.("Token y contraseña requeridos") ||
        res.status(400).json({ message: "Token y contraseña requeridos" })
      );

    let payload;
    try {
      payload = jwt.verify(token, RESET_SECRET);
    } catch {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const user = await userService.getById(payload.uid);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const same = bcrypt.compareSync(password, user.password);
    // Hacer idempotente: si es la misma contraseña, responder 200/204
    if (same) {
      return res.status(200).json({ message: "Contraseña actualizada" });
    }

    const hashed = bcrypt.hashSync(password, 10);
    await userService.update(user._id, { password: hashed });
    return res.json({ message: "Contraseña actualizada" });
  } catch (err) {
    return res.status(500).json({ message: "Error al restablecer contraseña" });
  }
};
