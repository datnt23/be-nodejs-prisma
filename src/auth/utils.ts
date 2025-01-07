import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import {
  AuthFailureResponse,
  ConflictResponse,
  ForbiddenResponse,
  GoneResponse,
} from "../core/error.response";
import { extractBearerToken } from "../utils/extract-token-string";
import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from "../config";
import { keyHeaders } from "./constants";
import { prisma } from "../database/db.config";
import UserService from "../services/user.service";

export const generateToken = async (
  payload: object,
  secretKey: string,
  expiresIn: string | number
): Promise<string> => {
  const token: string = await JWT.sign(payload, secretKey, {
    expiresIn,
  });

  return token;
};

export const verifyJWT = async (token: string, keySecret: string) => {
  try {
    return await JWT.verify(token, keySecret);
  } catch (error) {
    throw new Error(error as string);
  }
};

const checkUserExist = async (userId: number) => {
  const user = await UserService.findUserById({
    id: userId,
  });

  if (!user) {
    throw new ConflictResponse("User does not exist");
  }

  return user;
};

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshTokenBearerId: string | undefined =
    req.headers[keyHeaders.REFRESH_TOKEN_ID]?.toString();

  if (refreshTokenBearerId) {
    try {
      const refreshToken = await extractBearerToken(refreshTokenBearerId);

      const refreshTokenDecoded: any = await verifyJWT(
        refreshToken,
        KEY_REFRESH_TOKEN
      );

      const checkUser = await checkUserExist(refreshTokenDecoded.userId);

      req.user = checkUser;

      return next();
    } catch (err) {
      if ((err as Error).message?.includes("jwt expired")) {
        throw new AuthFailureResponse("Please login");
      }
    }
  }

  const accessToken: string | undefined =
    req.headers[keyHeaders.AUTHORIZATION]?.toString();
  if (!accessToken) throw new AuthFailureResponse("Invalid request");

  try {
    const accessTokenDecoded: any = await verifyJWT(
      await extractBearerToken(accessToken),
      KEY_ACCESS_TOKEN
    );

    const checkUser = await checkUserExist(accessTokenDecoded.userId);

    req.user = checkUser;

    return next();
  } catch (error) {
    if ((error as Error).message?.includes("jwt expired")) {
      throw new GoneResponse("Need to refresh token");
    }

    throw new AuthFailureResponse("Please login");
  }
};

export const permission = (permission: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.roles) {
      throw new ForbiddenResponse("Permission Denied!");
    }

    const validPermission = permission.some((role) =>
      req.user?.roles.includes(role)
    );

    if (!validPermission) {
      throw new ForbiddenResponse("You haven't access to this route!");
    }

    return next();
  };
};
