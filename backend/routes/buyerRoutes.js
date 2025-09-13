import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  createBulkBuyersSchema,
  createBuyerSchema,
  updateBuyerSchema,
} from "../validations/buyerSchemas.js";
import {
  getAllBuyers,
  getBuyerById,
  createBulkBuyers,
  createBuyer,
  updateBuyerById,
  deleteAllBuyers,
  deleteBuyerById,
} from "../controllers/buyerController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllBuyers); // Get all buyers
router.get("/:buyerId", getBuyerById); // Get a buyer by id

// Create a new buyer
router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBulkBuyersSchema),
  createBulkBuyers
);

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBuyerSchema),
  createBuyer
);

// Update buyer
router.put(
  "/:buyerId",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateBuyerSchema),
  updateBuyerById
);

// Delete buyer
router.delete("/all", authorizeRoles(["admin"]), deleteAllBuyers);
router.delete("/:buyerId", authorizeRoles(["admin"]), deleteBuyerById);

export default router;
