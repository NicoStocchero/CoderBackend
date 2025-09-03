import {
  renderHome,
  renderRealTimeProducts,
  renderProductsList,
  renderProductDetail,
  renderCartDetail,
} from "../controller/views.controller.js";
import { auth } from "../middlewares/authentication.js";
import { passportAuth } from "../middlewares/authentication.js";
import { CustomRouter } from "./router.js";

const router = new CustomRouter();

// Inicio
router.get("/", auth("public"), (req, res) => {
  res.render("home", { title: "Home" });
});

// Páginas de autenticación
router.get("/register", auth("public"), (req, res) => {
  res.render("register", { title: "Register" });
});

router.get("/login", auth("public"), (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/profile", passportAuth("current"), (req, res) => {
  res.render("profile", { title: "Profile", user: req.user });
});

router.get("/logout", passportAuth("current"), (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Vista de restablecimiento de contraseña (token por query)
router.get("/reset-password", auth("public"), (req, res) => {
  res.render("resetPassword", { title: "Restablecer contraseña" });
});

// Productos y carritos
router.get("/home", renderHome);
router.get("/realtimeproducts", renderRealTimeProducts);
router.get("/products", renderProductsList);
router.get("/products/:pid", renderProductDetail);
router.get("/carts/:cid", renderCartDetail);

export default router.getRouter();
