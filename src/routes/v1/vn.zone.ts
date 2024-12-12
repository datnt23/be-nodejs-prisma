import express, { Router } from "express";
import { asyncHandler } from "../../helpers/handlers";
import { isAuthorized } from "../../auth/utils";
import vietnamZoneController from "../../controllers/vn.zone.controller";
const router: Router = express.Router();

router.get("/provinces", asyncHandler(vietnamZoneController.getProvinces));

router.use(asyncHandler(isAuthorized));

export default router;
