import { ReasonPhrases, StatusCodes } from "http-status-codes";

//! Error response
class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

//! Conflict response
class ConflictResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.CONFLICT,
    status: number = StatusCodes.CONFLICT
  ) {
    super(message, status);
  }
}

//! Auth failure response
class AuthFailureResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    status: number = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

//! Not found response
class NotFoundResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.NOT_FOUND,
    status: number = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}

//! Forbidden response
class ForbiddenResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    status: number = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

//! Gone response
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
