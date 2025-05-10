import { AxiosError } from "axios";

export class RedirectError extends AxiosError {
  constructor(error: AxiosError, public redirectUrl: string) {
    super(
      error.message,
      error.code,
      error.config,
      error.request,
      error.response
    );
  }
}