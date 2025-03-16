import { User } from "@prisma/client";
import { AuthFailureResponse, ConflictResponse } from "../core/error.response";
import bcrypt from "bcrypt";
import { keyRoles } from "../auth/constants";
import { generateToken } from "../auth/utils";
import { format } from "date-fns";
import UserService from "./user.service";
import {
  KEY_ACCESS_TOKEN,
  KEY_REFRESH_TOKEN,
  TOKEN_TYPE,
  EXPIRES_IN_ACCESS_TOKEN,
  EXPIRES_IN_REFRESH_TOKEN,
} from "../config";

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

    const accessToken = await generateToken(
      {
        userId: foundUser.id,
        email,
        name: foundUser.fullName,
      },
      KEY_ACCESS_TOKEN,
      EXPIRES_IN_ACCESS_TOKEN
    );

    const refreshToken = await generateToken(
      {
        userId: foundUser.id,
        email,
        name: foundUser.fullName,
      },
      KEY_REFRESH_TOKEN,
      EXPIRES_IN_REFRESH_TOKEN
    );

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
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: TOKEN_TYPE,
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
      const accessToken = await generateToken(
        {
          userId: newUser.id,
          email,
          name: newUser.fullName,
        },
        KEY_ACCESS_TOKEN,
        EXPIRES_IN_ACCESS_TOKEN
      );

      const refreshToken = await generateToken(
        {
          userId: newUser.id,
          email,
          name: newUser.fullName,
        },
        KEY_REFRESH_TOKEN,
        EXPIRES_IN_REFRESH_TOKEN
      );

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
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: TOKEN_TYPE,
      };
    }

    return {
      code: 200,
      data: null,
    };
  };

  static me = async ({
    user,
  }: {
    user: any;
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
  }> => {
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        full_name: user.fullName,
        display_name: user.displayName,
        roles: user.roles,
        created_at: format(user.createdAt, "dd-MM-yyyy ss:mm:HH"),
        updated_at: format(user.updatedAt, "dd-MM-yyyy ss:mm:HH"),
        // deleted_at: format(user.deletedAt, "dd-MM-yyyy ss:mm:HH"),
      },
    };
  };

  static logout = async () => {
    return {};
  };

  static refreshToken = async (
    user: any
  ): Promise<{
    access_token?: string;
    token_type?: string;
  }> => {
    const { userId, email, name } = user;

    const accessToken = await generateToken(
      {
        userId,
        email,
        name,
      },
      KEY_ACCESS_TOKEN,
      EXPIRES_IN_ACCESS_TOKEN
    );

    return {
      access_token: accessToken,
      token_type: TOKEN_TYPE,
    };
  };
}

export default AuthService;
