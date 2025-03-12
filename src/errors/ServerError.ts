import { ApiError } from "./ApiError";

export class ServerError extends ApiError {
  constructor(message: string = "Something went wrong") {
    super(message, 500);
  }
}
