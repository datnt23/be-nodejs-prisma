import { NextFunction, Request, Response } from "express";
import { CreatedResponse, SuccessResponse } from "../core/success.response";
import AuthService from "../services/auth.service";

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Đăng nhập thành công!",
      data: await AuthService.login(req.body),
    }).send(res);
  };
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new CreatedResponse({
      message: "Đăng ký thành công!",
      data: await AuthService.signUp(req.body),
    }).send(res);
  };
}

export default new AuthController();
