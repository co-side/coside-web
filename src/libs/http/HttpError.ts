import { AxiosError } from "axios";

interface HttpErrorOptions {
  redirectUrl?: string;
}

export class HttpError extends AxiosError {
  constructor(error: AxiosError, public options: HttpErrorOptions = {}) {
    super(
      error.message,
      error.code,
      error.config,
      error.request,
      error.response
    );
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}