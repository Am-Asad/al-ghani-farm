import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { zodValidate } from "../middleware/zodValidate.js";
import {
  createBulkLedgersSchema,
  createLedgerSchema,
  updateLedgerSchema,
} from "../validations/ledgerSchemas.js";
import {
  getAllLedgers,
  getLedgerById,
  createBulkLedgers,
  createLedger,
  updateLedgerById,
  deleteAllLedgers,
  deleteLedgerById,
} from "../controllers/ledgerController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Routes
router.get("/", getAllLedgers); // Get all ledgers
router.get("/:ledgerId", getLedgerById); // Get a ledger by id

// Create a new ledger
router.post(
  "/bulk",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createBulkLedgersSchema),
  createBulkLedgers
);

router.post(
  "/",
  authorizeRoles(["admin", "manager"]),
  zodValidate(createLedgerSchema),
  createLedger
);

// Update ledger
router.put(
  "/:ledgerId",
  authorizeRoles(["admin", "manager"]),
  zodValidate(updateLedgerSchema),
  updateLedgerById
);

// Delete ledger
router.delete("/all", authorizeRoles(["admin"]), deleteAllLedgers);
router.delete("/:ledgerId", authorizeRoles(["admin"]), deleteLedgerById);

export default router;
