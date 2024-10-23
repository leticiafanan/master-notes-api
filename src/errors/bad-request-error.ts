import { AppError } from "./app-errors";

export class BadRequestError extends AppError {
  constructor(message?: string) {
    super(message || 'Bad Request Error.', 400)
  }
}