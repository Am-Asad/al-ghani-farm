import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import {
  // Buyer Reports
  getBuyerDailyReport,
  getBuyerOverallReport,
  getBuyerUnifiedReport,
  // Farm Reports
  getFarmDailyReport,
  getFarmOverallReport,
  // Flock Reports
  getFlockDailyReport,
  getFlockOverallReport,
  // Shed Reports
  getShedDailyReport,
  getShedOverallReport,
  // Universal Reports
  getUniversalReport,
} from "../controllers/reportController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// ==================== BUYER REPORTS ====================
router.get("/buyer/:buyerId/daily/:date", getBuyerDailyReport);
router.get("/buyer/:buyerId/overall", getBuyerOverallReport);
router.get("/buyer/:buyerId/unified", getBuyerUnifiedReport);

// ==================== FARM REPORTS ====================
router.get("/farm/:farmId/daily/:date", getFarmDailyReport);
router.get("/farm/:farmId/overall", getFarmOverallReport);

// ==================== FLOCK REPORTS ====================
router.get("/flock/:flockId/daily/:date", getFlockDailyReport);
router.get("/flock/:flockId/overall", getFlockOverallReport);

// ==================== SHED REPORTS ====================
router.get("/shed/:shedId/daily/:date", getShedDailyReport);
router.get("/shed/:shedId/overall", getShedOverallReport);

// ==================== UNIVERSAL REPORTS ====================
router.get("/universal", getUniversalReport);

export default router;
