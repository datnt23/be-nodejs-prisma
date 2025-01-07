import { NextFunction, Request, Response } from "express";
import { CreatedResponse, SuccessResponse } from "../core/success.response";
import AuthService from "../services/auth.service";
import { loginSchema, registerSchema } from "../validations/auth.schema";
import { StatusCodes } from "http-status-codes";
class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    const { success, error } = loginSchema.safeParse(req.body);
    if (!success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.issues[0].message,
      });
    }

    new SuccessResponse({
      message: "Log in successfully",
      data: await AuthService.login(req.body),
    }).send(res);
  };
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { success, error } = registerSchema.safeParse(req.body);
    if (!success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.issues[0].message,
      });
    }

    new CreatedResponse({
      message: "Registered successfully",
      data: await AuthService.register(req.body),
    }).send(res);
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      data: await AuthService.me({
        user: req.user,
      }),
    }).send(res);
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Log out successfully",
      data: await AuthService.logout(),
    }).send(res);
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Refresh token successfully",
      data: await AuthService.refreshToken({
        user: req.user,
      }),
    }).send(res);
  };
}

export default new AuthController();
