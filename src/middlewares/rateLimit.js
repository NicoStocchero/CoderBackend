import rateLimit from "express-rate-limit";

/**
 * Limita intentos de login para mitigar fuerza bruta
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

/**
 * Limita solicitudes de recuperación de contraseña
 */
export const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset requests. Try again later." },
});

export default { loginLimiter, forgotLimiter };
