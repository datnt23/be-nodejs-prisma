import { User } from "@prisma/client";
import {
  AuthFailureResponse,
  ConflictResponse,
  ForbiddenResponse,
} from "../core/error.response";
import { prisma } from "../database/db.config";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { keyRoles } from "../auth/constants";
import TokenService from "./token.service";
import { generateToken } from "../auth/utils";
import { format } from "date-fns";

class AuthService {
  static login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    user?: {
      id: number;
      email: string;
      first_name: string;
      middle_name?: string | null;
      last_name: string;
      full_name: string;
      roles: string[];
      created_at: string;
      updated_at: string;
      // deleted_at: string,
    };
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    code?: number;
    data?: null;
  }> => {
    // check email is exists
    const foundUser: User | null = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!foundUser) throw new ConflictResponse("User not registered");

    // check password matches
    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches)
      throw new AuthFailureResponse("Password do not match");

    // create publicKey and privateKey
    const publicKey = await crypto.randomBytes(64).toString("hex");
    const privateKey = await crypto.randomBytes(64).toString("hex");

    const tokens = await generateToken(
      {
        userId: foundUser.id,
        email,
        name: foundUser.fullName,
      },
      publicKey,
      privateKey
    );

    const keyToken: string | null = await TokenService.createKeyToken({
      userId: foundUser.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    if (!keyToken) throw new AuthFailureResponse("Key token error");

    return {
      user: {
        id: foundUser.id,
        email: foundUser.email,
        first_name: foundUser.firstName,
        middle_name: foundUser.middleName,
        last_name: foundUser.lastName,
        full_name: foundUser.fullName,
        roles: foundUser.roles,
        created_at: format(foundUser.createdAt, "dd-MM-yyyy ss:mm:HH"),
        updated_at: format(foundUser.updatedAt, "dd-MM-yyyy ss:mm:HH"),
        // deleted_at: format(newUser.deletedAt, "dd-MM-yyyy ss:mm:HH"),
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      token_type: "Bearer",
    };
  };

  static signUp = async ({
    email,
    password,
    firstName,
    middleName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
  }): Promise<{
    user?: {
      id: number;
      email: string;
      first_name: string;
      middle_name?: string | null;
      last_name: string;
      full_name: string;
      roles: string[];
      created_at: string;
      updated_at: string;
      // deleted_at: string,
    };
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    code?: number;
    data?: null;
  }> => {
    // check email is exists
    const foundUser: User | null = await prisma.user.findUnique({
      where: { email: email },
    });
    if (foundUser) throw new ConflictResponse("User already exists");

    // handle get full name
    let getFullName: string = "";
    if (middleName) {
      getFullName = firstName.concat(" ", middleName, " ", lastName);
    } else {
      getFullName = firstName.concat(" ", lastName);
    }

    // hash password
    const hashPassword: string = await bcrypt.hash(password, 10);

    // create new user
    const newUser: User = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        roles: [keyRoles.EMPLOYEE],
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        fullName: getFullName,
      },
    });

    if (newUser) {
      const publicKey = await crypto.randomBytes(64).toString("hex");
      const privateKey = await crypto.randomBytes(64).toString("hex");

      const tokens = await generateToken(
        {
          userId: newUser.id,
          email,
          name: newUser.fullName,
        },
        publicKey,
        privateKey
      );

      const keyToken: string | null = await TokenService.createKeyToken({
        userId: newUser.id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });
      if (!keyToken) throw new AuthFailureResponse("Key token error");

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.firstName,
          middle_name: newUser.middleName,
          last_name: newUser.lastName,
          full_name: newUser.fullName,
          roles: newUser.roles,
          created_at: format(newUser.createdAt, "dd-MM-yyyy ss:mm:HH"),
          updated_at: format(newUser.updatedAt, "dd-MM-yyyy ss:mm:HH"),
          // deleted_at: format(newUser.deletedAt, "dd-MM-yyyy ss:mm:HH"),
        },
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        token_type: "Bearer",
      };
    }

    return {
      code: 200,
      data: null,
    };
  };

  static logout = async (key: any) => {
    await TokenService.deleteById(key.id);
    return {};
  };

  static refreshToken = async ({
    refreshToken,
    user,
    keyStore,
  }: {
    refreshToken: any;
    user: any;
    keyStore: any;
  }) => {
    const { userId, email, name } = user;
    console.log(keyStore);
    console.log(refreshToken);
    console.log(user);
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await TokenService.deleteByUserId(userId);
      throw new ForbiddenResponse(
        "something went wrong please try login again"
      );
    }

    const tokens = await generateToken(
      {
        userId,
        email,
        name,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await TokenService.updateTokenUsedById(
      keyStore.id,
      refreshToken,
      tokens.refreshToken
    );

    return {
      user: {
        id: userId,
        email: email,
        full_name: name,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  };
}

export default AuthService;
