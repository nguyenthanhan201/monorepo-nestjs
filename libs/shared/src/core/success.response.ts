import { HttpStatus } from "@nestjs/common";
import { Response } from "express";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
};

class SuccessResponse {
  message;
  statusCode;
  metadata;

  constructor({
    message = ReasonStatusCode.OK,
    statusCode = HttpStatus.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
    options = {},
  }) {
    this.message = message ?? ReasonStatusCode.OK;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, header = {}) {
    console.log("header", this.statusCode);
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({
      message,
      metadata,
      options,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = HttpStatus.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
  }
}

class DELETED extends SuccessResponse {
  constructor({
    message,
    statusCode = HttpStatus.NO_CONTENT,
    metadata,
    options = {},
  }) {
    super({
      message,
      statusCode,
      metadata,
      options,
    });
  }
}

class UPDATED extends SuccessResponse {
  constructor({
    message,
    statusCode = HttpStatus.NO_CONTENT,
    metadata,
    options = {},
  }) {
    super({
      message,
      statusCode,
      metadata,
      options,
    });
  }
}

export { CREATED, DELETED, OK, SuccessResponse, UPDATED };
