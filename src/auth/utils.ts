import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { AuthFailureResponse, GoneResponse } from "../core/error.response";
import { keyHeaders } from "./constants";
import TokenService from "../services/token.service";
import { extractBearerToken } from "../utils/extract-token-string";
import UserService from "../services/user.service";

export const generateToken = async (
  payload: object,
  publicKey: string,
  privateKey: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken: string = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  const refreshToken: string = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });

  return { accessToken, refreshToken };
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
  // check for client missing
  const userId: number = Number(req.headers[keyHeaders.CLIENT_ID]);
  if (!userId) throw new AuthFailureResponse("Invalid request");

  // get user exists
  const foundUser = await UserService.findUserById(userId);
  if (!foundUser) throw new AuthFailureResponse("User not registered");

  // get token by user
  const keyStore = await TokenService.findByUserId(userId);
  if (!keyStore) throw new AuthFailureResponse("Token not found");

  const refreshTokenBearerId: string | undefined =
    req.headers[keyHeaders.REFRESH_TOKEN_ID]?.toString();
  if (refreshTokenBearerId) {
    try {
      const refreshToken = await extractBearerToken(refreshTokenBearerId);
      const refreshTokenDecoded: any = await verifyJWT(
        refreshToken,
        keyStore.privateKey
      );

      if (userId !== refreshTokenDecoded.userId)
        throw new AuthFailureResponse("Invalid user");

      req.keyStore = keyStore;
      req.user = refreshTokenDecoded;
      req.refreshToken = refreshToken;

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
      keyStore.publicKey
    );
    if (userId !== accessTokenDecoded.userId)
      throw new AuthFailureResponse("Invalid user");

    req.keyStore = keyStore;
    req.user = accessTokenDecoded;

    return next();
  } catch (error) {
    if ((error as Error).message?.includes("jwt expired")) {
      throw new GoneResponse("Need to refresh token");
    }

    throw new AuthFailureResponse("Please login");
  }
};
