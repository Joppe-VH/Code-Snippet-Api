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
  } else {
    res.status(500).json({ ...response, message: "Unexpected Server Error" });
  }
};
