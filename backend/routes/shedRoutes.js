import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  createShedSchema,
  updateShedSchema,
  createBulkShedsSchema,
} from "../validations/shedSchemas.js";
import {
  getAllSheds,
  getShedById,
  createBulkSheds,
  createShed,
  updateShedById,
  deleteAllSheds,
  deleteShedById,
} from "../controllers/shedController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllSheds); // Get all sheds
router.get("/:shedId", getShedById); // Get a shed by id

// Create a new shed
router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBulkShedsSchema),
  createBulkSheds
);

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createShedSchema),
  createShed
);

// Update shed
router.put(
  "/:shedId",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateShedSchema),
  updateShedById
);

// Delete shed
router.delete("/all", authorizeRoles(["admin"]), deleteAllSheds);
router.delete("/:shedId", authorizeRoles(["admin"]), deleteShedById);

export default router;
