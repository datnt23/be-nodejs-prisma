import { prisma } from "../database/db.config";

class UserService {
  static findUserById = async (id: number) => {
    return await prisma.user.findFirst({ where: { id: id } });
  };

  static findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email: email } });
  };

  static createNewUser = async ({
    email,
    password,
    roles,
    firstName,
    lastName,
    fullName,
    displayName,
  }: {
    email: string;
    password: string;
    roles: string[];
    firstName: string;
    lastName: string;
    fullName: string;
    displayName: string;
  }) => {
    return await prisma.user.create({
      data: {
        email,
        password,
        roles,
        firstName,
        lastName,
        fullName,
        displayName,
      },
    });
  };
}

export default UserService;
