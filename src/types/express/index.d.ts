import Express from "express";

declare global {
  namespace Express {
    interface Request {
      keyStore?: Record<string, any>;
      user?: Record<string, any>;
      refreshToken?: string;
    }
  }
}
