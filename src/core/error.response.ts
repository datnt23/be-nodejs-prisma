import { ReasonPhrases, StatusCodes } from "http-status-codes";

class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ConflictResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.CONFLICT,
    status: number = StatusCodes.CONFLICT
  ) {
    super(message, status);
  }
}

class AuthFailureResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    status: number = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class NotFoundResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.NOT_FOUND,
    status: number = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}
class ForbiddenResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    status: number = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}
class GoneResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.GONE,
    status: number = StatusCodes.GONE
  ) {
    super(message, status);
  }
}

export {
  ConflictResponse,
  AuthFailureResponse,
  NotFoundResponse,
  GoneResponse,
  ForbiddenResponse,
};
