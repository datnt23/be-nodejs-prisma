import { NextFunction, Request, Response } from "express";
import { CreatedResponse, SuccessResponse } from "../core/success.response";
import VnZoneService from "../services/vn.zone.service";
class VnZoneController {
  getProvinces = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get all province in successfully",
      data: await VnZoneService.getAllProvinces(),
    }).send(res);
  };
}

export default new VnZoneController();
