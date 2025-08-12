import {
  renderHome,
  renderRealTimeProducts,
  renderProductsList,
  renderProductDetail,
  renderCartDetail,
} from "../controller/views.controller.js";
import { auth } from "../middlewares/authentication.js";
import passport from "passport";
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

router.get(
  "/profile",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.render("profile", { title: "Profile", user: req.user });
  }
);

router.get(
  "/logout",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  }
);

// Productos y carritos
router.get("/home", renderHome);
router.get("/realtimeproducts", renderRealTimeProducts);
router.get("/products", renderProductsList);
router.get("/products/:pid", renderProductDetail);
router.get("/carts/:cid", renderCartDetail);

export default router.getRouter();
