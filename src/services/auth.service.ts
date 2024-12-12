import { User } from "@prisma/client";
import {
  AuthFailureResponse,
  ConflictResponse,
  ForbiddenResponse,
} from "../core/error.response";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { keyRoles } from "../auth/constants";
import TokenService from "./token.service";
import { generateToken } from "../auth/utils";
import { format } from "date-fns";
import UserService from "./user.service";

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
      last_name: string;
      full_name: string;
      display_name: string;
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
    //? check email is exists?
    const foundUser: User | null = await UserService.findUserByEmail(email);
    if (!foundUser) throw new ConflictResponse("User not registered");

    //? check password matches?
    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) throw new AuthFailureResponse("Password is wrong");

    //* create publicKey and privateKey
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
        last_name: foundUser.lastName,
        full_name: foundUser.fullName,
        display_name: foundUser.displayName,
        roles: foundUser.roles,
        created_at: format(foundUser.createdAt, "dd-MM-yyyy ss:mm:HH"),
        updated_at: format(foundUser.updatedAt, "dd-MM-yyyy ss:mm:HH"),
        // deleted_at: format(foundUser.deletedAt, "dd-MM-yyyy ss:mm:HH"),
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      token_type: "Bearer",
    };
  };

  static register = async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{
    user?: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
      display_name: string;
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
    //? check email is exists?
    const foundUser: User | null = await UserService.findUserByEmail(email);
    if (foundUser) throw new ConflictResponse("User already exists");

    //* handle get full name
    let getFullName: string = firstName.concat(" ", lastName);

    //* hash password
    const hashPassword: string = await bcrypt.hash(password, 10);

    //* create new user
    const newUser: User = await UserService.createNewUser({
      email,
      password: hashPassword,
      roles: [keyRoles.GUEST],
      firstName,
      lastName,
      fullName: getFullName,
      displayName: lastName,
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
          last_name: newUser.lastName,
          full_name: newUser.fullName,
          display_name: newUser.displayName,
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

  static me = async ({ user }: { user: any }) => {
    const userInfo: any = await UserService.findUserById(user.id);

    return {
      id: userInfo.id,
      email: userInfo.email,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      full_name: userInfo.fullName,
      display_name: userInfo.displayName,
      roles: userInfo.roles,
      created_at: format(userInfo.createdAt, "dd-MM-yyyy ss:mm:HH"),
      updated_at: format(userInfo.updatedAt, "dd-MM-yyyy ss:mm:HH"),
      // deleted_at: format(userInfo.deletedAt, "dd-MM-yyyy ss:mm:HH"),
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

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await TokenService.deleteByUserId(userId);
      throw new ForbiddenResponse(
        "Something went wrong please try login again"
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
