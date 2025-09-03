import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  clearCart,
  updateCartProducts,
  purchaseCart,
} from "../controller/cart.controller.js";
import { CustomRouter } from "./router.js";
import { ROLES } from "../constants/roles.js";
import validate from "../middlewares/validate.js";
import {
  cartIdSchema,
  cartProductSchema,
  updateQuantitySchema,
  replaceProductsSchema,
} from "../schemas/cart.schemas.js";
import { passportAuth } from "../middlewares/authentication.js";
import { authorize } from "../middlewares/authorization.js";

const router = new CustomRouter();

/**
 * POST /api/carts
 * Crea un nuevo carrito (con ID autogenerado y sin productos)
 */
router.post("/", passportAuth("current"), authorize([ROLES.USER]), createCart);
/**
 * GET /api/carts/:cid
 * Devuelve todos los productos de un carrito específico
 */
router.get("/:cid", validate(cartIdSchema), getCartById);

/**
 * POST /api/carts/:cid/product/:pid
 * Agrega un producto al carrito (si ya existe, incrementa cantidad)
 */
router.post(
  "/:cid/products/:pid",
  passportAuth("current"),
  authorize([ROLES.USER]),
  validate(cartProductSchema),
  addProductToCart
);

/**
 * DELETE /api/carts/:cid/products/:pid
 * Elimina un producto específico del carrito
 */
router.delete(
  "/:cid/products/:pid",
  passportAuth("current"),
  authorize([ROLES.USER]),
  validate(cartProductSchema),
  removeProductFromCart
);

/**
 * PUT /api/carts/:cid/products/:pid
 * Actualiza la cantidad de un producto en el carrito
 * Body: { quantity: number }
 */
router.put(
  "/:cid/products/:pid",
  passportAuth("current"),
  authorize([ROLES.USER]),
  validate(updateQuantitySchema),
  updateProductQuantity
);

/**
 * DELETE /api/carts/:cid
 * Vacía completamente el carrito
 */
router.delete(
  "/:cid",
  passportAuth("current"),
  authorize([ROLES.USER]),
  validate(cartIdSchema),
  clearCart
);

/**
 * PUT /api/carts/:cid
 * Reemplaza el array completo de productos del carrito
 * Body: { products: [ { product, quantity } ] }
 */
router.put(
  "/:cid",
  passportAuth("current"),
  authorize([ROLES.USER]),
  validate(replaceProductsSchema),
  updateCartProducts
);

/**
 * POST /api/carts/:cid/purchase
 * Procesa compra del carrito (solo user autenticado)
 */
router.post(
  "/:cid/purchase",
  passportAuth("current"),
  authorize([ROLES.USER]),
  validate(cartIdSchema),
  purchaseCart
);

export default router.getRouter();
