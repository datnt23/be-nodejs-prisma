import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import apiRoute from "./routes/index";
import { errorHandler, errorNotFound } from "./helpers/handlers";

const app: Express = express();

// middleware
app.use(morgan("dev")); // use for development
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database

// routes
app.use("/api", apiRoute);

// handling error
app.use(errorNotFound);
app.use(errorHandler);

export default app;
