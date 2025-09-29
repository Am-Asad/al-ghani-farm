import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import {
  getUniversalReport,
  exportUniversalReport,
} from "../controllers/reportController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

router.get("/universal", getUniversalReport);
router.get("/universal/export", exportUniversalReport);

export default router;
