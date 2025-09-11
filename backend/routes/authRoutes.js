import { Router } from "express";
import {
  userSignup,
  userSignin,
  userLogout,
  refreshAccessToken,
  userSignupBulk,
} from "../controllers/authController.js";
import { zodValidate } from "../middleware/zodValidate.js";
import { signupSchema, signinSchema } from "../validations/authSchemas.js";

const router = Router();

router.post("/signup", zodValidate(signupSchema), userSignup);
router.post("/signin", zodValidate(signinSchema), userSignin);
router.post("/logout", userLogout);
router.post("/refresh", refreshAccessToken);

export default router;
