import { CustomRouter } from "./router.js";
import passport from "passport";
import { authorize } from "../middlewares/authorization.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/users.controller.js";

const router = new CustomRouter();

// CRUD de usuarios (solo admin)
router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  getUsers
);
router.get(
  "/:uid",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  getUserById
);
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  createUser
);
router.put(
  "/:uid",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  updateUser
);
router.delete(
  "/:uid",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  deleteUser
);

export default router.getRouter();
