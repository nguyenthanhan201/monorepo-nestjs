// const logger = require("../loggers/winston.log");
// const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");

import { HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

class ErrorResponse extends HttpException {
  constructor(message, status) {
    super(message, status);

    // log the error use winston
    // logger.error(`${this.status} - ${message} - ${this.stack}`);
  }

  send(res: Response) {
    return res.status(this.getStatus()).json({
      status: "error",
      statusCode: this.getStatus(),
      message: this.message,
      stack: this.stack,
    });
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = HttpStatus.CONFLICT, statusCode = HttpStatus.CONFLICT) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = "Bad Request", statusCode = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = "Authentication failed",
    statusCode = HttpStatus.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = HttpStatus.NOT_FOUND,
    statusCode = HttpStatus.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = HttpStatus.FORBIDDEN,
    statusCode = HttpStatus.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class ServerError extends ErrorResponse {
  constructor(
    message = "Internal Server Error",
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

export {
  AuthFailureError,
  BadRequestError,
  ConflictRequestError,
  ErrorResponse,
  ForbiddenError,
  NotFoundError,
  ServerError,
};
