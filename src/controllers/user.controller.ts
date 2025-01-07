import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import UserService from "../services/user.service";

class UserController {
  getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get list user successfully",
      data: await UserService.getAllUser(),
    }).send(res);
  };
}

export default new UserController();
