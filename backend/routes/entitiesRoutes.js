import { Router } from "express";
import { authHandler } from "../middleware/authHandler.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { getAllEntities } from "../controllers/entitiesController.js";

const router = Router();

// Protect all routes
router.use(authHandler);

// Get all entities for dropdown options
router.get("/", authorizeRoles(["admin", "manager"]), getAllEntities);

export default router;
