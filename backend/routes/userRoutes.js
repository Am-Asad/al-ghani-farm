import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateSingleUser,
  deleteAllUsers,
  deleteBulkUsers,
  deleteSingleUser,
  getMeUser,
  createUserBulk,
} from "../controllers/userController.js";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  getAllUsersSchema,
  updateUserSchema,
  createUserSchema,
  createUserBulkSchema,
  deleteBulkUsersSchema,
} from "../validations/userSchemas.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", zodValidate(getAllUsersSchema), getAllUsers);
router.get("/me", getMeUser);
router.get("/:id", getSingleUser);

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createUserSchema),
  createUser
);
router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createUserBulkSchema),
  createUserBulk
);

router.put(
  "/:id",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateUserSchema),
  updateSingleUser
);

router.delete("/all", authorizeRoles(["admin"]), deleteAllUsers);
router.delete(
  "/bulk",
  authorizeRoles(["admin"]),
  zodValidate(deleteBulkUsersSchema),
  deleteBulkUsers
);
router.delete("/:id", authorizeRoles(["admin"]), deleteSingleUser);

export default router;
