import { ReasonPhrases } from "http-status-codes";
import { AuthFailureResponse } from "../core/error.response";

class AuthService {
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
      middle_name?: string;
      last_name: string;
      full_name: string;
      roles: string[];
      created_at: Date;
      updated_at: Date;
      // deleted_at: Date,
    };
    access_token?: string;
    refresh_token?: string;
    code?: number;
    data?: null;
  }> => {
    return {
      code: 200,
      data: null,
    };
  };
}

export default AuthService;
