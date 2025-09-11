import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateSingleUser,
  deleteAllUsers,
  deleteSingleUser,
  getMeUser,
  createUserBulk,
} from "../controllers/usersController.js";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  updateUserSchema,
  createUserSchema,
  createUserBulkSchema,
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
router.delete("/:id", authorizeRoles(["admin"]), deleteSingleUser);

export default router;
