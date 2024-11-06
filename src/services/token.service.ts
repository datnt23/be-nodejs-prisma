import { prisma } from "../database/db.config";

class TokenService {
  static createKeyToken = async ({
    userId,
    accessToken,
    refreshToken,
  }: {
    userId: number;
    accessToken: string;
    refreshToken: string;
  }) => {
    const create = {
        userId: userId,
        accessToken,
        refreshToken,
      },
      update = {
        accessToken,
        refreshToken,
      },
      where = { userId: userId };
    const token = await prisma.token.upsert({
      create,
      update,
      where,
    });

    return token ? token.accessToken : null;
  };
}

export default TokenService;
