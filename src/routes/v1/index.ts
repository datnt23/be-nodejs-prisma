import express, { Router } from "express";
import authRoute from "./auth";
import vnZoneRoute from "./vn.zone";
import userRoute from "./user";
const router: Router = express.Router();

router.use("/auth", authRoute);
router.use("/vn-zone", vnZoneRoute);
router.use("/user", userRoute);

export default router;
