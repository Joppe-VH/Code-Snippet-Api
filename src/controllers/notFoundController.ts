import { Request, Response } from "express";
import { NotFoundError } from "../errors";

export const notFound = (req: Request, res: Response) => {
  throw new NotFoundError("The requested endpoint doesn't exist.");
};
