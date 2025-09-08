import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateSingleUser,
  updateUserRole,
  deleteAllUsers,
  deleteSingleUser,
  getMeUser,
} from "../controllers/usersController.js";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  updateUserSchema,
  updateUserRoleSchema,
  createUserSchema,
} from "../validations/userSchemas.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllUsers);
router.get("/me", getMeUser);
router.get("/:id", getSingleUser);

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createUserSchema),
  createUser
);

router.patch(
  "/:id/role",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateUserRoleSchema),
  updateUserRole
);
router.put(
  "/:id",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateUserSchema),
  updateSingleUser
);

router.delete("/all", authorizeRoles(["admin"]), deleteAllUsers);
router.delete("/:id", authorizeRoles(["admin"]), deleteSingleUser);

export default router;
