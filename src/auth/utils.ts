import JWT, { VerifyErrors } from "jsonwebtoken";

export const createTokenPair = async (
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
