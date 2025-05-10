export class ServerComponentCookieError extends Error {
  constructor(public cookieSet: Record<string, string>) {
    super(`Server component don't cookie set.`);
    this.name = "ServerComponentCookieError";
  }
}