import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import { getUniversalReport } from "../controllers/reportController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

router.get("/universal", getUniversalReport);

export default router;
