import express, { Router } from "express";
import v1Route from "./v1/index";
const router: Router = express.Router();

router.use("/v1", v1Route);

export default router;
