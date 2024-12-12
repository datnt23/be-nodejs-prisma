import express, { Router } from "express";
import authRoute from "./auth";
import vnZoneRoute from "./vn.zone";
const router: Router = express.Router();

router.use("/auth", authRoute);
router.use("/vn-zone", vnZoneRoute);

export default router;
