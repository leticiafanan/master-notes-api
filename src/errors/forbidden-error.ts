import { AppError } from "./app-errors";

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message || 'Forbidden Error.', 403)
  }
}