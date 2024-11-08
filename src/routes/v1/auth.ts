import express, { Router } from "express";
import { asyncHandler } from "../../helpers/handlers";
import authController from "../../controllers/auth.controller";
import { isAuthorized } from "../../auth/utils";
const router: Router = express.Router();

router.post("/login", asyncHandler(authController.login));
router.post("/sign-up", asyncHandler(authController.signUp));

router.use(asyncHandler(isAuthorized));

router.get("/logout", asyncHandler(authController.logout));
router.get("/refresh-token", asyncHandler(authController.refreshToken));

export default router;
