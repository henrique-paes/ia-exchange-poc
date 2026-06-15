// Domain error codes — map 1:1 to the API contract (docs/specs/api.md).
export type ErrorCode = 'validation_error' | 'not_found' | 'conflict';

const STATUS: Record<ErrorCode, number> = {
  validation_error: 400,
  not_found: 404,
  conflict: 409,
};

// Base for all expected (operational) errors. The error handler turns these
// into the contract's JSON shape using `code` + `status`.
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details: unknown[];

  constructor(code: ErrorCode, message: string, details: unknown[] = []) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = STATUS[code];
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('not_found', `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('conflict', message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details: unknown[] = []) {
    super('validation_error', message, details);
  }
}
