import { Router } from "express";
import {
  createFarm,
  getAllFarms,
  getFarmsForDropdown,
  getFarmById,
  updateFarmById,
  deleteAllFarms,
  deleteBulkFarms,
  deleteFarmById,
  createBulkFarms,
  createDummyFarms,
} from "../controllers/farmController.js";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  createFarmSchema,
  updateFarmSchema,
  createBulkFarmsSchema,
  deleteBulkFarmsSchema,
} from "../validations/farmSchemas.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllFarms);
router.get("/dropdown", getFarmsForDropdown);
router.get("/:farmId", getFarmById);

router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBulkFarmsSchema),
  createBulkFarms
);
router.post("/dummy", authorizeRoles(["admin", "manager"]), createDummyFarms);
router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createFarmSchema),
  createFarm
);

router.put(
  "/:farmId",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateFarmSchema),
  updateFarmById
);

router.delete("/all", authorizeRoles(["admin"]), deleteAllFarms);
router.delete(
  "/bulk",
  authorizeRoles(["admin"]),
  zodValidate(deleteBulkFarmsSchema),
  deleteBulkFarms
);
router.delete("/:farmId", authorizeRoles(["admin"]), deleteFarmById);

export default router;
