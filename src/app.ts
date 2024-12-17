import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import crypto from "node:crypto";
import apiRoute from "./routes/index";
import { errorHandler, errorNotFound } from "./helpers/handlers";
import { main } from "./database/db.config";

const app: Express = express();
//* create accessKey and refreshKey
// const accessKey = crypto.randomBytes(64).toString("hex");
// const refreshKey = crypto.randomBytes(64).toString("hex");
// console.log(accessKey);
// console.log(refreshKey);

//* middleware
app.use(morgan("dev")); //TODO: use for development
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,

    // CORS will allow cookies to be received from the request
    credentials: true,
  })
);

//* database
main();

//* routes
app.use("/api", apiRoute);

//* handling error
app.use(errorNotFound);
app.use(errorHandler);

export default app;
