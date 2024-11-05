import { NextFunction, Request, Response } from "express";
import { CreatedResponse } from "../core/success.response";
import AuthService from "../services/auth.service";

class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new CreatedResponse({
      message: "Đăng ký thành công!",
      data: await AuthService.signUp(req.body),
    }).send(res);
  };
}

export default new AuthController();
