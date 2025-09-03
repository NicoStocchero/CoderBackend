import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/products.controller.js";
import { CustomRouter } from "./router.js";
import { ROLES } from "../constants/roles.js";
import validate from "../middlewares/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  getOrDeleteProductSchema,
} from "../schemas/product.schemas.js";
import { passportAuth } from "../middlewares/authentication.js";
import { authorize } from "../middlewares/authorization.js";

const router = new CustomRouter();

/**
 * GET /api/products
 * Devuelve todos los productos
 */
router.get("/", getAllProducts);

/**
 * GET /api/products/:pid
 * Devuelve un producto según su ID
 */
router.get("/:pid", validate(getOrDeleteProductSchema), getProductById);

/**
 * POST /api/products
 * Agrega un nuevo producto con campos obligatorios
 */
router.post(
  "/",
  passportAuth("current"),
  authorize([ROLES.ADMIN]),
  validate(createProductSchema),
  createProduct
);

/**
 * PUT /api/products/:pid
 * Actualiza campos de un producto existente (excepto el ID)
 */
router.put(
  "/:pid",
  passportAuth("current"),
  authorize([ROLES.ADMIN]),
  validate(updateProductSchema),
  updateProduct
);

/**
 * DELETE /api/products/:pid
 * Elimina un producto por ID
 */
router.delete(
  "/:pid",
  passportAuth("current"),
  authorize([ROLES.ADMIN]),
  validate(getOrDeleteProductSchema),
  deleteProduct
);

export default router.getRouter();
