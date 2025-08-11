import { CustomRouter } from "./router.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/users.controller.js";

const router = new CustomRouter();

// CRUD de usuarios (para pruebas/admin)
router.get("/", getUsers);
router.get("/:uid", getUserById);
router.post("/", createUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);

export default router.getRouter();
