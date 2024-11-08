import { prisma } from "../database/db.config";

class TokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: number;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
  }) => {
    const create = {
        userId: userId,
        publicKey,
        privateKey,
        refreshToken,
      },
      update = {
        publicKey,
        privateKey,
        refreshToken,
      },
      where = { userId: userId };
    const token = await prisma.token.upsert({
      create,
      update,
      where,
    });

    return token ? token.publicKey : null;
  };

  static updateTokenUsedById = async (
    id: number,
    refreshToken: string,
    newRefreshToken: string
  ) => {
    return await prisma.token.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: newRefreshToken,
        refreshTokenUsed: { push: refreshToken },
      },
    });
  };

  static findByUserId = async (id: number) => {
    return await prisma.token.findUnique({ where: { userId: id } });
  };

  static deleteByUserId = async (userId: number) => {
    return await prisma.token.delete({
      where: {
        userId: userId,
      },
    });
  };

  static deleteById = async (id: number) => {
    return await prisma.token.delete({ where: { id: id } });
  };
}

export default TokenService;
