import { Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

interface SuccessResponseProps {
  message?: string;
  status?: number;
  reasonStatus?: string;
  data?: Record<string, unknown>;
}
class SuccessResponse {
  message: string;
  status: number;
  data: Record<string, unknown>;
  constructor({
    message,
    status = StatusCodes.OK,
    reasonStatus = ReasonPhrases.OK,
    data = {},
  }: SuccessResponseProps) {
    this.message = !message ? reasonStatus : message;
    this.status = status;
    this.data = data;
  }

  send(res: Response, headers: Record<string, string> = {}): Response {
    return res.status(this.status).json(this);
  }
}

interface CreatedResponseProps extends SuccessResponseProps {
  options?: Record<string, unknown>;
}

class CreatedResponse extends SuccessResponse {
  options: Record<string, unknown>;
  constructor({
    message,
    status = StatusCodes.CREATED,
    reasonStatus = ReasonPhrases.CREATED,
    data,
    options = {},
  }: CreatedResponseProps) {
    super({ message, status, reasonStatus, data });
    this.options = options;
  }
}

export { SuccessResponse, CreatedResponse };
