import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { AuthFailureResponse, GoneResponse } from "../core/error.response";
import { keyHeaders } from "./constants";
import { extractBearerToken } from "../utils/extract-token-string";
import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from "../config";

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
  return await JWT.verify(token, keySecret, (err, decode) => {
    if (err) {
      console.error(`Error verify::`, err.message);
      throw new AuthFailureResponse("Invalid token");
    } else {
      console.log(`Decode verify::`, decode);
      return decode;
    }
  });
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

      req.user = refreshTokenDecoded;

      return next();
    } catch (error) {
      throw error;
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

    req.user = accessTokenDecoded;

    return next();
  } catch (error) {
    if ((error as Error).message?.includes("jwt expired")) {
      throw new GoneResponse("Need to refresh token");
    }

    throw new AuthFailureResponse("Please login");
  }
};
