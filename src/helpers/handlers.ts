import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { env, NODE_ENV } from "../config";
import { NotFoundResponse } from "../core/error.response";
import path from "path";
import { format } from "date-fns";
import { appendFile } from "fs/promises";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

export const errorNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: Error = new NotFoundResponse();
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!err.status) err.status = StatusCodes.INTERNAL_SERVER_ERROR;

  logHandler(`${req.url} ---- ${req.method} ---- ${err.message}`);

  const responseError = {
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    stack: err.stack,
  };

  if (NODE_ENV !== env.dev) delete responseError.stack;

  res.status(err.status).json(responseError);
};

const fileName: string = path.join(__dirname, "../logs", "logs.log");

export const logHandler = async (message: string) => {
  const dateTime: string = `${format(new Date(), "dd-MM-yyyy\tss:mm:HH")}`;
  const contentLog: string = `${dateTime} --- ${message}\n`;
  try {
    await appendFile(fileName, contentLog);
  } catch (error) {
    console.error(error);
  }
};
