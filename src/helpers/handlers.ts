import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env, NODE_ENV } from "../config";
import { NotFoundResponse } from "../core/error.response";

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

  const responseError = {
    code: err.status,
    message: err.message || StatusCodes[err.status],
    stack: err.stack,
  };

  if (NODE_ENV !== env.dev) delete responseError.stack;

  res.status(err.status).json(responseError);
};
