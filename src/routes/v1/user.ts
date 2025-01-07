import express, { Router } from "express";
import { asyncHandler } from "../../helpers/handlers";
import userController from "../../controllers/user.controller";
import { isAuthorized, permission } from "../../auth/utils";
import { keyRoles } from "../../auth/constants";

const router: Router = express.Router();

router.use(asyncHandler(isAuthorized));

router.get(
  "/",
  permission([keyRoles.GUEST, keyRoles.EMPLOYEE, keyRoles.ADMIN]),
  asyncHandler(userController.getAllUser)
);

export default router;
