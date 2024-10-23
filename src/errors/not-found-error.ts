import { AppError } from "./app-errors";

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Not Found Error.', 404)
  }
}