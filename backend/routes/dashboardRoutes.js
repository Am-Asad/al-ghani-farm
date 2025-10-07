import express from "express";
import {
  getDashboardSummary,
  getRecentActivity,
  getDashboardStats,
} from "../controllers/dashboardController.js";
import { authHandler } from "../middleware/authHandler.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(authHandler);

// GET /api/dashboard/summary - Get dashboard summary data
router.get("/summary", getDashboardSummary);

// GET /api/dashboard/activity - Get recent activity
router.get("/activity", getRecentActivity);

// GET /api/dashboard/stats - Get dashboard statistics
router.get("/stats", getDashboardStats);

export default router;
