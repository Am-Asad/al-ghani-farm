import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  createFlockSchema,
  updateFlockSchema,
  createBulkFlocksSchema,
} from "../validations/flockSchemas.js";
import {
  getAllFlocks,
  getFlockById,
  updateFlock,
  deleteFlock,
  createFlock,
  createBulkFlocks,
  deleteAllFlocks,
} from "../controllers/flockController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllFlocks); // Get all flocks
router.get("/:flockId", getFlockById); // Get a flock by id

// Create a new flock
router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createFlockSchema),
  createFlock
);

router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBulkFlocksSchema),
  createBulkFlocks
);

// Update flock
router.put(
  "/:flockId",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateFlockSchema),
  updateFlock
);

// Delete flock
router.delete("/all", authorizeRoles(["admin"]), deleteAllFlocks);
router.delete("/:flockId", authorizeRoles(["admin"]), deleteFlock);

export default router;
