import passport from "passport";
import { CustomRouter } from "./router.js";
import {
  registerController,
  loginController,
  currentController,
  logoutController,
} from "../controller/sessions.controller.js";

const router = new CustomRouter();

// Registro de usuario
router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  registerController
);

// Login -> genera cookie JWT y guarda datos mínimos en sesión para vistas
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  loginController
);

// Current -> valida JWT y devuelve el usuario del token
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  currentController
);

// Logout -> borra cookie JWT y destruye la sesión
router.post("/logout", logoutController);

export default router.getRouter();
