import { CustomRouter } from "./router.js";
import { loginLimiter, forgotLimiter } from "../middlewares/rateLimit.js";
import { passportAuth } from "../middlewares/authentication.js";
import {
  registerController,
  loginController,
  currentController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from "../controller/sessions.controller.js";

const router = new CustomRouter();

// Registro de usuario
router.post("/register", passportAuth("register"), registerController);

// Login -> genera cookie JWT y guarda datos mínimos en sesión para vistas
router.post("/login", loginLimiter, passportAuth("login"), loginController);

// Current -> valida JWT y devuelve el usuario del token
router.get("/current", passportAuth("current"), currentController);

// Logout -> borra cookie JWT y destruye la sesión
router.post("/logout", logoutController);

// Recuperación de contraseña
router.post("/forgot", forgotLimiter, forgotPasswordController);
router.post("/reset", resetPasswordController);

export default router.getRouter();
