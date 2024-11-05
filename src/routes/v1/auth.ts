import express, { Router } from "express";
import { asyncHandler } from "../../helpers/handlers";
import authController from "../../controllers/auth.controller";
const router: Router = express.Router();

router.post("/sign-up", asyncHandler(authController.signUp));

export default router;
