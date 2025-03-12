import { ZodError } from "zod";
import { ApiError } from "../errors";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = {
    method: req.method,
    endpoint: req.originalUrl,
  };
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ ...response, message: err.message });
  } else if (err instanceof ZodError) {
    res.status(422).json({
      ...response,
      message: "Validation Error",
      errors: err.errors.map((e) => e.message),
    });
  } else {
    console.error(err);
    res.status(500).json({ ...response, message: "Unexpected Server Error" });
  }
};
