import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import apiRoute from "./routes/index";
import { errorHandler, errorNotFound } from "./helpers/handlers";
import { main } from "./database/db.config";

const app: Express = express();

//* middleware
app.use(morgan("dev")); //TODO: use for development
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//* database
main();

//* routes
app.use("/api", apiRoute);

//* handling error
app.use(errorNotFound);
app.use(errorHandler);

export default app;
