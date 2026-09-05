export class ApplicationError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class AuthenticationRequiredError extends ApplicationError {
  constructor() {
    super("Authentication is required.", "AUTHENTICATION_REQUIRED", 401);
  }
}

export class AuthorizationDeniedError extends ApplicationError {
  constructor(permission?: string) {
    super("You are not allowed to perform this action.", "AUTHORIZATION_DENIED", 403, {
      permission,
    });
  }
}

export class ResourceNotFoundError extends ApplicationError {
  constructor(resource: string) {
    super(`${resource} was not found.`, "NOT_FOUND", 404, { resource });
  }
}
