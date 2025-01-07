import { Prisma } from "@prisma/client";
import { prisma } from "../database/db.config";
import { getSelectData } from "../utils";

class UserService {
  static findUserById = async ({
    id,
    isSelect,
    unSelect,
  }: {
    id: number;
    isSelect?: string[];
    unSelect?: string[];
  }) => {
    let allFields = Object.keys(Prisma.UserScalarFieldEnum);

    if (isSelect) {
      allFields = allFields.filter((field) => isSelect.includes(field));
    }

    if (unSelect) {
      allFields = allFields.filter((field) => !unSelect.includes(field));
    }

    return await prisma.user.findFirst({
      where: { id: id },
      select: { ...getSelectData(allFields) },
    });
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

  static getAllUser = async () => {
    const getAll = await prisma.user.findMany({
      where: {
        NOT: {
          roles: {
            has: "admin",
          },
        },
      },
    });

    return { users: getAll };
  };
}

export default UserService;
