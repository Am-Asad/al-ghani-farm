import { Router } from "express";
import {
  createFarm,
  getAllFarms,
  getSingleFarm,
  updateSingleFarm,
  deleteAllFarms,
  deleteSingleFarm,
  createBulkFarms,
  getAllFlocksByFarmId,
} from "../controllers/farmController.js";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  createFarmSchema,
  updateFarmSchema,
  createBulkFarmsSchema,
} from "../validations/farmSchemas.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllFarms);
router.get("/:farmId/flocks", getAllFlocksByFarmId);
router.get("/:farmId", getSingleFarm);

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createFarmSchema),
  createFarm
);
router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBulkFarmsSchema),
  createBulkFarms
);

router.put(
  "/:farmId",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateFarmSchema),
  updateSingleFarm
);

router.delete("/all", authorizeRoles(["admin"]), deleteAllFarms);
router.delete("/:farmId", authorizeRoles(["admin"]), deleteSingleFarm);

export default router;
